import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { LocalStrategy, JwtStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenEntity } from './entities';

@Module( {
  imports: [
    PassportModule.register( {
      defaultStrategy: 'jwt'
    } ),
    UserModule,
    JwtModule.registerAsync( {
      inject: [ ConfigService ],
      useFactory: ( config: ConfigService ) => ( {
        secret: config.get<string>( 'JWT_SECRET' ),
        signOptions: { expiresIn: config.get<string>( 'JWT_EXPIRES_IN' ) }
      } )
    } ),
    TypeOrmModule.forFeature( [ RefreshTokenEntity ] )
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy
  ],
  controllers: [ AuthController ]
} )
export class AuthModule { }
