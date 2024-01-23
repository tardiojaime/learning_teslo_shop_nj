import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  getStaticProductImage(imgName: string) {
    const paths = join(__dirname, '../../static/products', imgName);
    if (!existsSync(paths)) {
      throw new BadRequestException(`No product found with image ${imgName}`);
    }
    return paths;
  }
}
