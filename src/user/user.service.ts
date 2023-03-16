import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createQueryBuilder } from 'src/common/helpers';
import { GetProps } from 'src/common/interfaces/get-props.interface';
import { GetResponse } from 'src/common/interfaces/get-response.interface';
import { Repository } from 'typeorm';
import { CreateUserDto, EditUserDto } from './dtos';
import { User } from './entities';

@Injectable()
export class UserService {

	constructor (
		@InjectRepository( User )
		private readonly userRepository: Repository<User>
	) { }

	async getMany ( getProps: GetProps ): Promise<GetResponse<User>> {

		try {

			if ( getProps.search && getProps.search !== '' ) {
				getProps.where = {
					query: `user.name LIKE :s 
						OR user.email LIKE :s
						OR user.surnames LIKE :s
						OR user.address LIKE :s
						OR user.phone LIKE :s
						OR user.postalCode LIKE :s`,
					params: { s: `%${ getProps.search }%` }
				}
			}

			const getResponse = await createQueryBuilder<User>( this.userRepository, getProps, 'user' );

			if ( !getResponse || getResponse.data.length === 0 ) { throw 'Not found' }
			return getResponse;

		} catch ( error ) {
			if ( error === 'Not found' ) { throw new NotFoundException(); }
			throw new InternalServerErrorException();
		}

	}

	async getOne ( id: number ): Promise<User> {

		try {
			const user = await this.userRepository.findOne( { where: { id } } );

			if ( !user ) { throw 'Not found' }
			return user;

		} catch ( error ) {
			if ( error === 'Not found' ) { throw new NotFoundException(); }
			throw new InternalServerErrorException();
		}

	}

	async createOne ( dto: CreateUserDto ): Promise<User> {

		try {

			const user = this.userRepository.create( dto as Object );
			const userDb = await this.userRepository.save( user );
			delete userDb.password;

			return userDb;

		} catch ( error ) {
			if ( ( error as any ).code === 'ER_DUP_ENTRY' ) {
				throw new BadRequestException( 'Email already exist' );
			}
			throw new InternalServerErrorException();
		}
	}

	async editOne ( id: number, dto: EditUserDto ): Promise<User> {

		try {

			const user = await this.userRepository.findOne( { where: { id } } );
			if ( !user ) { throw 'Not found'; }

			const editedUser = Object.assign( user, dto );
			return await this.userRepository.save( editedUser );

		} catch ( error ) {
			if ( ( error as any ).code === 'ER_DUP_ENTRY' ) {
				throw new BadRequestException( 'Email already exist' );
			}
			if ( error === 'Not found' ) { throw new NotFoundException(); }
			throw new InternalServerErrorException();
		}

	}

	async deleteOne ( id: number ): Promise<any> {

		try {

			return await this.userRepository.delete( id );

		} catch ( error ) {
			throw new InternalServerErrorException();
		}

	}

	async findByEmail ( email: string ): Promise<User> {

		try {

			const user = await this.userRepository
				.createQueryBuilder( 'user' )
				.where( { email } )
				.select( [ 'user.email', 'user.name', 'user.id', 'user.roles', 'user.isActive' ] )
				.addSelect( 'user.password' )
				.getOne();

			return user;

		} catch ( error ) {
			throw new InternalServerErrorException();
		}

	}

}
