import { Body, Controller, Delete, Get, InternalServerErrorException, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { AppResources, AppRoles } from 'src/app.roles';
import { Auth, User } from 'src/common/decorators';
import { stringToInt } from 'src/common/helpers/string-to-int.helper';
import { GetProps } from 'src/common/interfaces/get-props.interface';
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
	async getMany (
		@Query( 'search' ) search?: string | undefined,
		@Query( 'page' ) page?: string | undefined,
		@Query( 'limit' ) limit?: string | undefined,
		@Query( 'sort_c' ) sortC?: string | undefined,
		@Query( 'sort_d' ) sortD?: 'asc' | 'desc' | undefined,
		@Query( 'select' ) select?: string | undefined,
		@Query( 'sg1' ) searchSigle1?: string | undefined,
		@Query( 'sg2' ) searchSigle2?: string | undefined,
		@Query( 'sg3' ) searchSigle3?: string | undefined,
		@Query( 'sg4' ) searchSigle4?: string | undefined,
	) {

		const getProps: GetProps = {};
		getProps.page = page ? stringToInt( page ) > 0 ? stringToInt( page ) : 1 : 1;
		getProps.limit = limit ? stringToInt( limit ) : 10;
		getProps.sort = {
			column: sortC || 'createdAt',
			direction: sortD ? sortD.toUpperCase() as 'DESC' | 'ASC' : 'DESC'
		};
		getProps.select = select && select !== '' ? select.split( '|' ) : [];
		getProps.search = search && search.trim() !== '' ? search.trim() : undefined;

		getProps.andWhere = [];
		if ( searchSigle1 && searchSigle1.trim() !== '' ) {
			getProps.andWhere.push( { field: 'name', value: searchSigle1.trim() } );
		}
		if ( searchSigle2 && searchSigle2.trim() !== '' ) {
			getProps.andWhere.push( { field: 'surnames', value: searchSigle2.trim() } );
		}
		if ( searchSigle3 && searchSigle3.trim() !== '' ) {
			getProps.andWhere.push( { field: 'email', value: searchSigle3.trim() } );
		}
		if ( searchSigle4 && searchSigle4.trim() !== '' ) {
			getProps.andWhere.push( { field: 'isActive', value: searchSigle4.trim() === 'true' ? 1 : 0 } );
		}

		const getResponse = await this.userService.getMany( getProps );
		return {
			message: 'Users list',
			statusCode: 200,
			total: getResponse.total || 0,
			page: getResponse.page || 1,
			last_page: getResponse.last_page || 1,
			data: getResponse.data
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
		@Param( 'id', ParseIntPipe ) id: number,
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
