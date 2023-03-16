import {
	PrimaryGeneratedColumn,
	Column,
	Entity,
	ManyToMany,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { IsOptional, IsString, IsEmpty, IsNumber } from 'class-validator';
import { User as UserEntity } from 'src/user/entities';

@Entity( { name: 'files' } )
export class FileEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@Column( { length: 50 } )
	@IsString( { always: true } )
	@IsEmpty( { always: true, message: 'hey...' } )
	// tslint:disable-next-line: variable-name
	original_name: string;

	@Column( { length: 50 } )
	@IsString( { always: true } )
	@IsEmpty( { always: true, message: 'hey...' } )
	// tslint:disable-next-line: variable-name
	current_name: string;

	@Column( { length: 50 } )
	@IsString( { always: true } )
	@IsEmpty( { always: true, message: 'hey...' } )
	extention: string;

	@Column( { type: 'int' } )
	@IsNumber()
	@IsEmpty( { always: true, message: 'hey...' } )
	size: number;

	// @ManyToOne(
	// 	() => UserEntity,
	// 	( user: UserEntity ) => user.files,
	// 	{ onUpdate: 'CASCADE', onDelete: 'CASCADE' },
	// )
	// @JoinColumn( { name: 'user_id' } )
	// user: UserEntity;


}