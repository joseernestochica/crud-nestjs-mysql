import { User } from "src/user/entities";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity( 'refresh-tokens' )
export class RefreshTokenEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@Column( { type: 'varchar', nullable: false, length: '64' } )
	token: string;

	@CreateDateColumn( { type: 'timestamp', nullable: false } )
	created: Date;

	@CreateDateColumn( { type: 'timestamp', nullable: false } )
	expires: Date;

	@Column( { type: 'varchar', nullable: false, length: '30' } )
	ip?: string;

	@ManyToOne( ( type ) => User, ( user ) => user.id, {
		onDelete: 'CASCADE'
	} )
	@JoinColumn( { name: 'user_id' } )
	userId: number

}