import {
  AfterUpdate,
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from 'src/auth/entities/user.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text', {
    unique: true,
  })
  title: string;
  @Column('float', {
    default: 0,
  })
  price: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;
  @Column({
    type: 'text',
    unique: true,
  })
  slug: string;
  @Column('int', {
    default: 0,
  })
  stock: number;

  @Column('text', {
    array: true,
  })
  sizes: string[];

  @Column('text')
  gender: string;

  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];
  // Un Producto puede tener uno o varias imagenes / ? o tambien tener 0
  //
  @OneToMany(
    //Retornar imagenes
    () => ProductImage,
    // relacion -> productImage.product | product en ProductImage
    (productImage) => productImage.product,
    {
      cascade: true,
      eager: true,
    },
  )
  // el eager - carga todas las relaciones solo en consultas find*
  images?: ProductImage[];
  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user: User;

  // AFterInsert update -
  // antes de insertar
  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) this.slug = this.title;
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @AfterUpdate()
  checkSlugUpdate() {
    if (this.slug) {
      this.slug = this.slug
        .toLowerCase()
        .replaceAll("'", '')
        .replaceAll(' ', '_');
    }
  }
}
