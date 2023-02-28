import { Body, Controller, Delete, Get, Post, Query, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppResources } from 'src/app.roles';
import { Auth, User } from 'src/common/decorators';
import { User as UserEntity } from 'src/user/entities';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards';

@ApiTags( 'Auth routes' )
@Controller( 'auth' )
export class AuthController {

	constructor (
		private readonly authService: AuthService
	) { }

	@UseGuards( LocalAuthGuard )
	@Post( 'login' )
	async login (
		@User() user: UserEntity,
		@Query() query: any
	) {

		const data = await this.authService.login( user, query.ip || '' );
		return {
			message: 'Login ok',
			statusCode: 200,
			data
		};

	}

	@Auth()
	@Get( 'profile' )
	profile (
		@User() user: UserEntity
	) {

		return {
			message: 'Profile data',
			statusCode: 200,
			data: user
		};

	}

	@Auth()
	@Get( 'check-token' )
	checkToken () {

		return {
			message: 'token ok',
			statusCode: 200
		};

	}

	@Post( 'refresh' )
	async refreshToken (
		@Body() body: { refresh_token: string, user: string, ip: string }
	) {

		const data = await this.authService.refreshToken(
			{ refreshToken: body.refresh_token, user: parseInt( body.user, 10 ), ip: body.ip || '' } );

		return {
			message: 'Refresh token ok',
			statusCode: 200,
			data
		};

	}

	@Auth( {
		possession: 'any',
		action: 'delete',
		resource: AppResources.AUTH
	} )
	@Delete( 'refresh-user/:id' )
	async deleteRefreshToken (
		@Param( 'id', ParseIntPipe ) id: number
	) {

		await this.authService.deleteRefreshToken( id );

		return {
			message: 'Delete refresh token ok',
			statusCode: 200
		};

	}

}
