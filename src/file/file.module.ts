import { Module } from '@nestjs/common';
import { GenericService } from 'src/generic/generic.service';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module( {
  controllers: [ FileController ],
  providers: [ FileService, GenericService ]
} )
export class FileModule { }
