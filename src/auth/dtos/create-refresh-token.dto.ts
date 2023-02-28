import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";


export class CreateRefreshTokenDto {

	@IsNumber()
	userId: number;

	@IsString()
	token: string;

	@IsDate()
	created: Date;

	@IsDate()
	expires: Date;

	@IsString()
	@IsOptional()
	ip?: string;

}