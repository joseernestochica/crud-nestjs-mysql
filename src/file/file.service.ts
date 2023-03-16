import { Injectable } from '@nestjs/common';
import { FileInterface } from './interfaces/file.interface';

@Injectable()
export class FileService {

	mapUploadFile ( { originalname, mimetype, size }: Express.Multer.File, newFileName: string, ): FileInterface {
		// const { originalname, mimetype, size } = file;
		return {
			name: originalname,
			size,
			extention: mimetype.split( '/' )[ 1 ], // mimetype: 'image/jpeg'
		};
	}

}
