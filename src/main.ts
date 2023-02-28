import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { initSwagger } from './app.swagger';

async function bootstrap () {

  const app = await NestFactory.create( AppModule, {
    cors: { origin: true, credentials: true }
  } );
  const logger = new Logger();
  const config = app.get( ConfigService );
  const port = config.get<number>( 'SERVER_PORT' ) || 3000;

  app.useGlobalPipes( new ValidationPipe( { whitelist: true } ) );
  app.use( helmet() );

  initSwagger( app );

  await app.listen( port );
  logger.log( `Server running in localhost: ${ await app.getUrl() }` );
}
bootstrap();
