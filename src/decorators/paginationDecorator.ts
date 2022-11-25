
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PaginationParams } from "../commonDto/paginationParams.dto";

export const Pagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const query = ctx.switchToHttp().getRequest().query;

    const sortBy = query.sortBy as string || "createdAt";
    const sortDirection = query.sortDirection as string || "desc";
    const pageNumber = parseInt(query.pageNumber) || 1;
    const pageSize = parseInt(query.pageSize) || 10;

    const paginationParams: PaginationParams = {
      pageNumber,
      pageSize,
      sortBy: sortBy.trim(),
      sortDirection: sortDirection.trim()
    };

    return paginationParams;
  },
);