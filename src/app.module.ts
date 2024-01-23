import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      // se debe cargar todas las entidades
      autoLoadEntities: true,
      // sincroniza cualquier cambio con la bd
      synchronize: true,
      //no se recomienda utilizar en produccion
    }),
    ProductsModule,
    CommonModule,
    SeedModule,
  ],
})
export class AppModule {}
