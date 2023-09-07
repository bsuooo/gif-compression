import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync } from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'uploads',
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return file.path;
  }

  @Get('compression')
  compression(
    @Query('path') path: string,
    @Query('color', ParseIntPipe) color: number,
  ) {
    if (!existsSync(path)) {
      throw new BadRequestException('没有查找到文件, 请重新上传');
    }
    console.log(path, color);
  }
}
