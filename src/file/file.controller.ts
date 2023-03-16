import {
	Controller,
	Post,
	UseInterceptors,
	UploadedFile,
	Get,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 } from 'uuid';
import { diskStorage } from 'multer';
import { readFile } from 'fs';
import { promisify } from 'util';
const readFileAsyc = promisify( readFile );
import { GenericService } from 'src/generic/generic.service';
import { FileInterface } from './interfaces/file.interface';
import * as sharp from 'sharp';

@Controller( 'file' )
export class FileController {

	private readonly sizes: string[];
	private pcoket: any;
	static genericSercive: GenericService;

	constructor (
		public fileService: FileService, genericSercive: GenericService
	) {

		FileController.genericSercive = genericSercive;
		this.sizes = [ '25X25', '50X50', '50X50', '200X200', '400X400', '900X900' ];

	}

	@Post( 'upload' )
	@UseInterceptors(
		FileInterceptor( 'file', {
			storage: diskStorage( {
				destination: ( req: Express.Request, file: Express.Multer.File, cb ) =>
					cb( null, 'public/images' ),
				filename: ( req: Express.Request, file: Express.Multer.File, cb ) => {
					// mimetype: 'image/jpeg',
					const [ , ext ] = file.mimetype.split( '/' );
					FileController.genericSercive.pcoket.filename = `${ v4() }.${ ext }`;
					cb( null, FileController.genericSercive.pcoket.filename );
				},
			} ),
			limits: {
				fileSize: 1e7, // the max file size in bytes, here it's 100MB,
				files: 1,
			},
		} ),
	)
	uploadFile (
		@UploadedFile() file: Express.Multer.File
	): FileInterface {

		const [ , ext ] = file.mimetype.split( '/' );
		this.saveImages( ext, file );

		return this.fileService.mapUploadFile( file, FileController.genericSercive.pcoket.filename );

		// return this.service.dbSave(
		// 	file,
		// 	FilesController.genericSercive.pcoket.filename,
		// );
	}

	private async saveImages (
		ext: string,
		file: Express.Multer.File,
	): Promise<void> {
		if ( [ 'jpeg', 'jpg', 'png' ].includes( ext ) ) {
			this.sizes.forEach( ( s: string ) => {
				const [ size ] = s.split( 'X' );
				readFileAsyc( file.path )
					.then( ( b: Buffer ) => {
						return sharp( b )
							.resize( +size )
							.toFile(
								`${ __dirname }/../../public/images/${ s }/${ FileController.genericSercive.pcoket.filename }`,
							);
					} )
					.then( console.log )
					.catch( console.error );
			} );
		}
	}

	// private async saveImages ( ext: string, file: Express.Multer.File ): Promise<void> {

	// 	if ( [ 'jpeg', 'jpg', 'png' ].includes( ext ) ) {
	// 		this.sizes.forEach( ( s: number ) => {
	// 			console.log( s );
	// 			readFileAsyc( file.path )
	// 				.then( async ( b: Buffer ) => {
	// 					console.log( b );
	// 					const image = await Jimp.read( b );
	// 					console.log( image );


	// 					// Jimp.read( b ).then( ( img ) => {
	// 					// 	return img
	// 					// 		.resize( s, s ) // resize
	// 					// 		.quality( 100 ) // set JPEG quality
	// 					// 		.greyscale() // set greyscale
	// 					// 		.write( `${ __dirname }/../../public/images/${ s }/${ FileController.genericSercive.pcoket.filename }` ); // save
	// 					// } );

	// 					// return sharp( b )
	// 					// 	.resize( +size )
	// 					// 	.toFile(
	// 					// 		`${ __dirname }/../../public/uploads/${ s }/${ FileController.genericSercive.pcoket.filename }`,
	// 					// 	);
	// 				} )
	// 				.then( console.log )
	// 				.catch( console.error );
	// 		} );
	// 	}

	// }


}
