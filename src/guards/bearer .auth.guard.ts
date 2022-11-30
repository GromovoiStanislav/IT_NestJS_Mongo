import {
  CanActivate,
  ExecutionContext,
  Injectable, UnauthorizedException
} from "@nestjs/common";
import { Observable } from "rxjs";
import { JWT_Service } from "../utils/jwtService";

@Injectable()
export class BearerAuthGuard implements CanActivate {

  constructor(private jwtService: JWT_Service) {
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    let token = request.header("Authorization");
    if (!token) {
      throw new UnauthorizedException();
    }

    token = token.split(' ')[1]
    const userId = this.jwtService.getUserIdByToken(token)
    if(!userId){
      throw new UnauthorizedException();
    }

    request.userId = userId
    return true
  }
}