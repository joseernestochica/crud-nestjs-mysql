import { PartialType, OmitType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./index";

export class EditUserDto extends PartialType(
	OmitType( CreateUserDto, [ 'createdAt' ] as const ) ) { }