import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export const initSwagger = ( app: INestApplication ) => {
	const swaggerConfig = new DocumentBuilder()
		.setTitle( 'Bcakend Nest - MySQL' )
		.addBearerAuth()
		.setDescription(
			'Esta es una API de un backend modelo en Nest y Mysql',
		)
		.build();
	const document = SwaggerModule.createDocument( app, swaggerConfig );
	SwaggerModule.setup( '/docs', app, document );
};