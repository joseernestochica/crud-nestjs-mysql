import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { User } from "../../user/entities";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy( Strategy ) {

	constructor (
		private readonly authService: AuthService
	) {
		super( {
			usernameField: 'email',
			passwordField: 'password',
		} );
	}

	async validate ( email: string, password: string ): Promise<User> {

		const user = await this.authService.validateUser( email, password );
		if ( !user ) { throw new UnauthorizedException( 'Email or password not match' ); }
		if ( !user.isActive ) { throw new UnauthorizedException( 'User is not active' ); }
		return user;

	}

}