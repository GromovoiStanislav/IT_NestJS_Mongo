import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Settings } from "../../settings";


@Injectable()
export class JWT_Service {
  constructor(
    private jwtService: JwtService,
    private settings: Settings
  ) {}

  async createAuthJWT(userId: string): Promise<string> {
    return this.jwtService.signAsync({ userId },{ secret: this.settings.SECRET, expiresIn: '1h' });
  };

  async createRefreshJWT(userId: string): Promise<string> {
    return this.jwtService.signAsync({ userId },{ secret: this.settings.SECRET, expiresIn: '2h' });
  };

  async getUserIdByToken(token: string): Promise<string | null> {
    try {
      const data = await this.jwtService.verifyAsync(token, { secret: this.settings.SECRET});
      return data.userId
    } catch (e) {
      return null;
    }
  }
}