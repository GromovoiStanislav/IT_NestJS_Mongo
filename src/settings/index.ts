import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class Settings {
  EMAIL: string;
  EMAIL_PASSWORD: string;

  constructor(private configService: ConfigService) {
    this.EMAIL = configService.get<string>("EMAIL");
    this.EMAIL_PASSWORD = configService.get<string>("EMAIL_PASSWORD");
  }

}