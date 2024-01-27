import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userReposotory: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userCreate } = createUserDto;
      const user = this.userReposotory.create({
        ...userCreate,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userReposotory.save(user);
      //se elimina del objeto para no enviar al cliente
      delete user.password;
      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      console.log(error);
      this.handleDbErrors(error);
    }
  }
  async login(loginDto: LoginUserDto) {
    const { password, email } = loginDto;
    const user = await this.userReposotory.findOne({
      where: { email },
      select: { id: true, email: true, password: true },
    });
    if (!user)
      throw new UnauthorizedException('Credentials are not valid (email)');
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)');
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }
  async checkStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }
  private getJwtToken(payload: JwtPayload) {
    // este servicio toma la configuracion de JwtModule en AUth.module
    const token = this.jwtService.sign(payload);
    return token;
  }

  findAll() {
    return this.userReposotory.find({});
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
  private handleDbErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error);
    throw new InternalServerErrorException(`Please check server logs `);
  }
}
