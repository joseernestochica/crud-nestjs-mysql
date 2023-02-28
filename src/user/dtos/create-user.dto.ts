import { IsArray, IsBoolean, IsDate, IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { AppRoles } from "src/app.roles";

export class CreateUserDto {

	@IsString()
	@IsOptional()
	img: string;

	@IsString()
	@IsOptional()
	sexo: string;

	@IsDate()
	@IsOptional()
	birthDate: Date | null;

	@IsDate()
	@IsOptional()
	createdAt: Date;

	@IsBoolean()
	isActive: boolean;

	@IsBoolean()
	isLoginGoogle: boolean;

	@IsBoolean()
	isLoginFacebook: boolean;

	@IsEmail()
	email: string;

	@IsString()
	name: string;

	@IsString()
	surnames: string;

	@IsString()
	@MinLength( 8 )
	@MaxLength( 100 )
	password: string;

	@IsString()
	@IsOptional()
	address: string;

	@IsString()
	@IsOptional()
	phone: string;

	@IsString()
	@IsOptional()
	postalCode: number;

	@IsString()
	@IsOptional()
	city: string;

	@IsString()
	@IsOptional()
	state: string;

	@IsString()
	@IsOptional()
	country: string;

	@IsString()
	@IsOptional()
	nif: string;

	@IsArray()
	@IsEnum( AppRoles, {
		each: true,
		message: `must be a valid role value`
	} )
	roles: string[]

}