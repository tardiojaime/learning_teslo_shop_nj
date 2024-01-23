import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { PaginateDTO } from 'src/common/dto/pagination.dot';
import { validate as isUuid } from 'uuid';
import { DataSource, Repository } from 'typeorm';
import { ProductImage } from './entities/product-image.entity';

@Injectable()
export class ProductsService {
  private logger = new Logger('Prodcutos');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
  ) {}
  async create(createProductDto: CreateProductDto) {
    try {
      // '...', se llame operador rest
      const { images = [], ...productDetails } = createProductDto;
      // cuando se crea junto con un producto no es necesario
      // agregar el id del producto a la imagen creada
      // '...productDetails' operador spret
      const prod = this.productRepository.create({
        ...productDetails,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
      });
      await this.productRepository.save(prod);
      return prod;
      // otra forma de devolver el producto creado sin el id de las
      // images
      // return { ...prod, images };
    } catch (error) {
      // console.log(error);
      this.handleDBExeptions(error);
    }
  }

  async findAll(paginateDto: PaginateDTO) {
    const { limit = 10, offset = 0 } = paginateDto;
    try {
      const prod = await this.productRepository.find({
        take: limit,
        skip: offset,
        relations: {
          images: true,
        },
      });
      return prod.map((product) => ({
        ...product,
        images: product.images.map((img) => img.url),
      }));
      // otra forma con rest | images, ...resto
      // return prod.map(({ images, ...product }) => ({
      //   ...product,
      //   images: images.map((img) => img.url),
      // }));
    } catch (error) {
      this.handleDBExeptions(error);
    }
  }

  async findOne(ter: string) {
    let product: Product;
    // para utilizar isUuid - debemos instalar uuid, y @types/uuid
    if (isUuid(ter)) {
      product = await this.productRepository.findOneBy({ id: ter });
    } else {
      // product = await this.productRepository.findOneBy({ slug: ter });
      // prod en query es el alias
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      //verificar si utilizando una funcion ya no realiza la busque por indeces pgsql
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: ter.toUpperCase(),
          slug: ter.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }
    // para cargar relaciones leftjoinAndSelect 'relacion', 'alias' para trabajar luego
    if (!product)
      throw new NotFoundException(`No existe el producto con el ter: ${ter}`);
    return product;
  }

  async findOnePlan(term: string) {
    const { images = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map((img) => img.url),
    };
  }
  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...updateDate } = updateProductDto;
    // carga el producto
    const product = await this.productRepository.preload({
      id,
      ...updateDate,
    });
    if (!product)
      throw new NotFoundException(`Product with id: ${id} not found`);
    // create query runner una transaccion
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        product.images = images.map((img) =>
          this.productImageRepository.create({ url: img }),
        );
      }

      await queryRunner.manager.save(product);
      // confirmamos la transsaccion
      await queryRunner.commitTransaction();
      // liberar conexion
      await queryRunner.release();

      //await this.productRepository.save(product);
      return this.findOnePlan(id);
    } catch (error) {
      queryRunner.rollbackTransaction();
      // liberar - realease
      queryRunner.release();
      this.handleDBExeptions(error);
    }
  }

  async remove(id: string) {
    const prod = await this.findOne(id);
    await this.productRepository.remove(prod);
  }
  // manejar excepciones de la base de datos
  private handleDBExeptions(error: any) {
    // 23505 - existencia
    if (error.code === '23505') {
      // detalla los errores
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    // error inesperado
    // verifique los registros del servidor
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('query');
    try {
      // vaciar todo
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBExeptions(error);
    }
  }
}
