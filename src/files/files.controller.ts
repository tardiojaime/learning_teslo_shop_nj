import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileName.helper';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configServece: ConfigService,
  ) {}
  @Get('product/:imgname')
  findProductImage(@Res() res: Response, @Param('imgname') imgname: string) {
    const path = this.filesService.getStaticProductImage(imgname);
    // return path;
    // con res de expres control absoluto de las respuestas
    /* res.status(403).json({
      ok: false,
      path: path,
    }); */
    res.sendFile(path);
  }
  @Post('product')
  // el nombre del archivo que se espera
  // fileFilter recibe una function, le pasamos la referencia
  //  de nuestra funcion
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      //limits: { fileSize: 1000}
      storage: diskStorage({
        destination: './static/uploads',
        filename: fileNamer,
      }),
    }),
  )
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Make sure that file is an image');
    // geenramos una ruta para mostrarlo -- llamamos al primer metodo
    // q utilizando Res de express nos retorna la imagen
    const secureUrl = `${this.configServece.get('HOST_API')}/files/product/${file.filename}`;
    return { secureUrl };
  }
}
