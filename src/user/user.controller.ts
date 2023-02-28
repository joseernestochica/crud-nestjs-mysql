import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { AppResources, AppRoles } from 'src/app.roles';
import { Auth, User } from 'src/common/decorators';
import { CreateUserDto, EditUserDto, UserRegistrationDto } from './dtos';
import { User as UserEntity } from './entities';
import { UserService } from './user.service';

@ApiTags( 'Users' )
@Controller( 'user' )
export class UserController {

	constructor (
		private readonly userService: UserService,

		@InjectRolesBuilder()
		private readonly rolesBuilder: RolesBuilder
	) { };

	@Auth( {
		possession: 'any',
		action: 'read',
		resource: AppResources.USER
	} )
	@Get()
	async getMany () {

		const data = await this.userService.getMany();
		return {
			message: 'Users list',
			statusCode: 200,
			data
		};

	}

	@Auth( {
		possession: 'own',
		action: 'read',
		resource: AppResources.USER
	} )
	@Get( ':id' )
	async getOne (
		@Param( 'id', ParseIntPipe ) id: number,
		@User() user: UserEntity
	) {

		let data = {};

		if ( this.rolesBuilder.can( user.roles ).readAny( AppResources.USER ).granted ) { // Admin
			data = await this.userService.getOne( id );
		} else { // Author
			data = await this.userService.getOne( user.id );
		}

		return {
			message: 'User data',
			statusCode: 200,
			data
		};

	}

	@Post( 'register' )
	async userRegistration ( @Body() dto: UserRegistrationDto ) {

		const data = await this.userService.createOne( { ...dto, roles: [ AppRoles.AUTHOR ] } );

		return {
			message: 'User registered ok',
			statusCode: 200,
			data
		};

	}

	@Auth( {
		possession: 'any',
		action: 'create',
		resource: AppResources.USER
	} )
	@Post()
	async createOne ( @Body() dto: CreateUserDto ) {

		const data = await this.userService.createOne( dto );

		return {
			message: 'User created ok',
			statusCode: 200,
			data
		};

	}

	@Auth( {
		possession: 'own',
		action: 'update',
		resource: AppResources.USER
	} )
	@Put( ':id' )
	async editOne (
		@Param( 'id', ParseIntPipe, ) id: number,
		@Body() dto: EditUserDto,
		@User() user: UserEntity
	) {

		let data = {};

		if ( this.rolesBuilder.can( user.roles ).updateAny( AppResources.USER ).granted ) { // Admin
			data = await this.userService.editOne( id, dto );
		} else { // Author
			const { roles, ...rest } = dto;
			data = await this.userService.editOne( user.id, rest );
		}

		return {
			message: 'User edited ok',
			statusCode: 200,
			data
		};

	}

	@Auth( {
		possession: 'own',
		action: 'delete',
		resource: AppResources.USER
	} )
	@Delete( ':id' )
	async deleteOne (
		@Param( 'id', ParseIntPipe ) id: number,
		@User() user: UserEntity
	) {

		let data = {}

		if ( this.rolesBuilder.can( user.roles ).updateAny( AppResources.USER ).granted ) { // Admin
			data = await this.userService.deleteOne( id );
		} else { // Author
			data = await this.userService.deleteOne( user.id );
		}

		return {
			message: 'User deleted ok',
			statusCode: 200,
			data
		};

	}

}
