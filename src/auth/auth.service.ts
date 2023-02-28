import { Injectable, InternalServerErrorException, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { uid } from 'rand-token';
import { MoreThan, Repository } from 'typeorm';
import { User } from '../user/entities';
import { UserService } from '../user/user.service';
import { CreateRefreshTokenDto } from './dtos/create-refresh-token.dto';
import { RefreshTokenEntity } from './entities';

@Injectable()
export class AuthService {

	constructor (
		private readonly userService: UserService,
		private readonly jwtService: JwtService,

		@InjectRepository( RefreshTokenEntity )
		private readonly refreshTokenRepository: Repository<RefreshTokenEntity>
	) { }

	private async createRefreshToken ( user: User, ip: string ): Promise<string> {

		try {

			await this.refreshTokenRepository.delete( { userId: user.id } );
			const refreshTokenUid = uid( 40 );

			const refreshTokenDto: CreateRefreshTokenDto = {
				userId: user.id,
				token: refreshTokenUid,
				created: new Date(),
				expires: new Date( Date.now() + 7 * 24 * 60 * 60 * 1000 ),
				ip
			};

			const refreshToken = this.refreshTokenRepository.create( refreshTokenDto as Object );
			await this.refreshTokenRepository.save( refreshToken );
			return refreshTokenUid;

		} catch ( error ) {
			throw new InternalServerErrorException();
		}

	}

	async validateUser ( email: string, password: string ): Promise<User | undefined> {

		const user = await this.userService.findByEmail( email );
		if ( user && await compare( password, user.password ) ) { return user; }
		return undefined;

	}

	async login ( user: User, ip: string ): Promise<any> {

		const payload = { sub: user.id }
		delete user.password;

		const refreshTokenUid = await this.createRefreshToken( user, ip );

		return {
			user,
			accessToken: this.jwtService.sign( payload ),
			refreshToken: refreshTokenUid
		}

	}

	async refreshToken ( tokenProps: { refreshToken: string, user: number, ip?: string } ): Promise<any> {

		try {

			const { refreshToken, user, ip } = tokenProps;
			if ( !refreshToken || !user || user < 1 ) { throw 'bad resquest'; }

			const count = await this.refreshTokenRepository.count( { where: { userId: user, token: refreshToken, expires: MoreThan( new Date ) } } );
			if ( count === 0 ) { throw 'not authorized'; }

			const userDb = await this.userService.getOne( user );
			if ( !userDb ) { throw 'not found'; }

			return await this.login( userDb, ip );

		} catch ( error ) {
			if ( error === 'bad resquest' ) { throw new InternalServerErrorException(); }
			if ( error === 'not authorized' ) { throw new UnauthorizedException(); }
			if ( error === 'not found' ) { throw new NotFoundException(); }
			throw new BadRequestException();
		}

	}

	async deleteRefreshToken ( userId: number ) {

		try {

			await this.refreshTokenRepository.delete( { userId } );

		} catch ( error ) {
			throw new BadRequestException();
		}

	}

}
