import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    private readonly product: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async runSeed() {
    await this.deleteTables();
    const firstuser = await this.insertUsers();
    await this.inserNewProducts(firstuser);
    return 'SEED EXECUTE';
  }
  private async inserNewProducts(user: User) {
    await this.product.deleteAllProducts();
    const products = initialData.products;
    const insertPromises = [];
    products.forEach((prod) =>
      insertPromises.push(this.product.create(prod, user)),
    );
    // espera que todas las promesas se resuelva
    await Promise.all(insertPromises);
  }
  private async insertUsers() {
    const seedUser = initialData.users;
    const users: User[] = [];
    seedUser.forEach((user) => {
      //tambien se puede incriptar directamente en seed
      user.password = bcrypt.hashSync(user.password, 10);
      users.push(this.userRepository.create(user));
    });
    const user = await this.userRepository.save(users);
    return user[0];
  }

  private async deleteTables() {
    await this.product.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }
}
