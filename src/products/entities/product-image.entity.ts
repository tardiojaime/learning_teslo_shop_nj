import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'product_images' })
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  url: string;

  @ManyToOne(
    // retornar Product
    () => Product,
    // relacion product.images | images en Product
    (product) => product.images,
    // si se elimina un producto, se eliminaran todas imgs del product
    { onDelete: 'CASCADE' },
  )
  product: Product;
}
