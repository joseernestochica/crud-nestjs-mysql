import { hash } from "bcryptjs";
import { RefreshTokenEntity } from "src/auth/entities";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity( 'users' )
@Unique( [ 'email' ] )
export class User {

	@PrimaryGeneratedColumn()
	id!: number;

	@Column( { type: 'varchar', length: 255, nullable: true } )
	img?: string;

	@Column( { type: 'varchar', length: 1, nullable: true } )
	sex?: string;

	@Column( { name: 'birth_date', type: 'timestamp', nullable: true } )
	birthDate?: Date | null;

	@CreateDateColumn( { name: 'created_at', type: 'timestamp', nullable: false } )
	createdAt!: string;

	@Column( { type: 'simple-array' } )
	roles!: string[];

	@Column( { name: 'active', type: 'boolean', default: true } )
	isActive!: boolean;

	@Column( { name: 'login_google', type: 'boolean', default: false } )
	isLoginGoogle!: boolean;

	@Column( { name: 'login_facebook', type: 'boolean', default: false } )
	isLoginFacebook!: boolean;

	@Column( { type: 'varchar', length: 255, nullable: false } )
	email!: string;

	@Column( { type: 'varchar', length: 100 } )
	name!: string;

	@Column( { type: 'varchar', length: 255 } )
	surnames!: string;

	@Column( { type: 'varchar', length: 128, nullable: false, select: false } )
	password!: string;

	@Column( { type: 'varchar', length: 255, nullable: true } )
	address?: string;

	@Column( { type: 'varchar', length: 20, nullable: true } )
	phone?: string;

	@Column( { name: 'postal_code', type: 'varchar', length: 10, nullable: true } )
	postalCode?: number;

	@Column( { type: 'varchar', length: 50, nullable: true } )
	city?: string;

	@Column( { type: 'varchar', length: 50, nullable: true } )
	state?: string;

	@Column( { type: 'varchar', length: 3, nullable: true } )
	country?: string;

	@Column( { type: 'varchar', length: 15, nullable: true } )
	nif?: string;

	@BeforeInsert()
	@BeforeUpdate()
	async hashPassword () {
		if ( !this.password ) { return; }
		this.password = await hash( this.password, 10 );
	}

	@OneToMany( ( type ) => RefreshTokenEntity, ( refreshToken ) => refreshToken.userId )
	refreshTokens: RefreshTokenEntity[];

}