import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    if (!request.userId) {
      throw Error("BearerAuthGuard must be used");
    }
    return request.userId;
  }
);