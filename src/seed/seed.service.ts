import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(private readonly product: ProductsService) {}
  async runSeed() {
    await this.insertNewProducts();
    const products = initialData.products;
    const insertPromise = [];
    products.forEach((prod) => insertPromise.push(this.product.create(prod)));
    // espera que todas las promesas se resuelva
    await Promise.all(insertPromise);
    // despues sigues
    return true;
  }
  private async insertNewProducts() {
    await this.product.deleteAllProducts();
    return true;
  }
}
