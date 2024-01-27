import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { GetHeader } from './decorators/get-RowHeader.decorator';
import { IncomingHttpHeaders } from 'http';
import { UseRoleGuard } from './guards/use-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces/valid-roles';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }
  @Post('login')
  loginUser(@Body() loginUserdto: LoginUserDto) {
    return this.authService.login(loginUserdto);
  }
  @Get('check-status')
  @Auth()
  checkStatus(@GetUser() user: User) {
    return this.authService.checkStatus(user);
  }
  @Get()
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetHeader() header: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    // console.log(request);

    return { ok: true, message: 'public', user, header, headers };
  }

  @Get('private')
  // @SetMetadata('roles', ['admin', 'super-user'])
  // en ves de utilizar SetMetadata | creamis Un decorador
  // RoleProtected para recibir los metadatos
  @RoleProtected(ValidRoles.admin, ValidRoles.user)
  @UseGuards(AuthGuard(), UseRoleGuard)
  private2(@GetUser() user: User) {
    return { ok: true, user };
  }
  @Get('private3')
  @Auth(ValidRoles.admin)
  private3(@GetUser() user: User) {
    return { ok: true, user };
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
