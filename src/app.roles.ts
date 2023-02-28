import { RolesBuilder } from "nest-access-control";

export enum AppRoles {
	ADMIN = 'ADMIN',
	AUTHOR = 'AUTHOR',
};

export enum AppResources {
	USER = 'USER',
	AUTH = 'AUTH'
};

export const roles: RolesBuilder = new RolesBuilder();

roles
	.grant( AppRoles.AUTHOR )
	.updateOwn( [ AppResources.USER ] )
	.deleteOwn( [ AppResources.USER ] )
	.readOwn( [ AppResources.USER ] )

	.grant( AppRoles.ADMIN )
	.extend( AppRoles.AUTHOR )
	.createAny( [ AppResources.USER ] )
	.updateAny( [ AppResources.USER ] )
	.deleteAny( [ AppResources.USER, AppResources.AUTH ] )
	.readAny( [ AppResources.USER ] )
