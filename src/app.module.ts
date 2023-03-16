import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccessControlModule } from 'nest-access-control';
import { roles } from './app.roles';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { LocationModule } from './location/location.module';
import { FileModule } from './file/file.module';

@Module( {
  imports: [
    TypeOrmModule.forRootAsync( {
      inject: [ ConfigService ],
      useFactory: ( config: ConfigService ) => ( {
        type: 'mysql',
        host: config.get<string>( 'DATABASE_HOST' ),
        port: config.get<number>( 'DATABASE_PORT' ),
        username: config.get<string>( 'DATABASE_USERNAME' ),
        password: config.get<string>( 'DATABASE_PASSWORD' ),
        database: config.get<string>( 'DATABASE_NAME' ),
        entities: [ join( __dirname, '**', '*.entity.{ts,js}' ) ],
        synchronize: true
      } )
    } ),
    ConfigModule.forRoot( { isGlobal: true, envFilePath: '.env' } ),
    AccessControlModule.forRoles( roles ),
    UserModule,
    AuthModule,
    LocationModule,
    FileModule
  ],
  controllers: [ AppController ],
  providers: [ AppService ],
} )
export class AppModule { }
