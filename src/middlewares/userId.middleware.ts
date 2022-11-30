import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { JWT_Service } from "../utils/jwtService";

@Injectable()
export class UserIdMiddleware implements NestMiddleware {

  constructor(
    private jwtService: JWT_Service) {
  }

  async use(req: Request, res: Response, next: NextFunction) {

    let userId = null;
    let token = req.header['Authorization'];
    if (token) {
      token = token.replace('Bearer ','');
      userId = await this.jwtService.getUserIdByToken(token);
    }
    // @ts-ignore`
    req.userId = userId;
    next();
  }
}