import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
// data - los parametros que se envia @GetUser('para') -> data.para | @Getuser(['uno','tree'])
export const GetUser = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    if (!user)
      throw new InternalServerErrorException('User not found - (request)');
    if (data) {
      const ob = {};
      if (Array.isArray(data)) {
        data.forEach(
          (data) =>
            (ob[data] = user[data] ? user[data] : `${data} is undefined`),
        );
        return ob;
      } else {
        // data in user ? user[data]: console.log('0n exidste');
        return user[data] ? user[data] : `${data} is undefined`;
      }
    }
    return user;
  },
);
