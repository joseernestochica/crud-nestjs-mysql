import { IsArray, IsBoolean, IsDate, IsDateString, IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { AppRoles } from "src/app.roles";

export class CreateUserDto {

	@IsString()
	@IsOptional()
	img: string;

	@IsString()
	@IsOptional()
	sex: string;

	@IsDateString()
	@IsOptional()
	birthDate: Date | null;

	@IsDateString()
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
	@MinLength( 6 )
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
	postalCode: string;

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