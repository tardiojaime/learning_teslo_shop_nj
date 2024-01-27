import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetHeader = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    // console.log(req.rawHeaders);
    return req.rawHeaders;
  },
);
