import {
  Controller,
  Post,
  Get,
  Res,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { existsSync, unlinkSync } from 'fs';
import * as sharp from 'sharp';

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
  async compression(
    @Query('path') path: string,
    @Query('color', ParseIntPipe) color: number,
    @Query('level') level: number,
    @Res() res: Response,
  ) {
    if (!existsSync(path)) {
      throw new BadRequestException('没有查找到文件, 请重新上传');
    }

    const numberLevel = Number(level);

    if (numberLevel > 1 || numberLevel < 0) {
      throw new BadRequestException('级别在0.1 - 1.0 之间!');
    }

    const data = await sharp(path, {
      animated: true,
      limitInputPixels: false,
    })
      .gif({ colours: color, dither: numberLevel })
      .toBuffer();
    // 压缩完后删除文件
    // sharp.cache({ files: 0 });
    // unlinkSync(path);

    res.set('Content-Disposition', `attachment; filename="dest.gif"`);
    res.send(data);
  }
}
