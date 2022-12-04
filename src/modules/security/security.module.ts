import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { SecurityController } from "./security.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Security, SecuritySchema } from "./schemas/security.schema";
import {
  AddOrUpdateDeviceSessionUseCase,
  ClearAllDevicesUseCase, KillSessionByDeviceIdUseCase,
  ReturnAllDeviceSessionsByCurrentUserUseCase,
  TerminateAllOtherDeviceSessionsExcludeCurrentUserUseCase, TerminateDeviceSessionUseCase
} from "./security.service";
import { JWT_Module } from "../jwt/jwt.module";
//import * as cookieParser from 'cookie-parser';



const useCases = [
  ClearAllDevicesUseCase,
  ReturnAllDeviceSessionsByCurrentUserUseCase,
  TerminateAllOtherDeviceSessionsExcludeCurrentUserUseCase,
  TerminateDeviceSessionUseCase,
  AddOrUpdateDeviceSessionUseCase,
  KillSessionByDeviceIdUseCase
];

@Module({
  imports: [
    CqrsModule, JWT_Module,
    MongooseModule.forFeature([{ name: Security.name, schema: SecuritySchema }])
  ],
  controllers: [SecurityController],
  providers: [...useCases]
})
export class SecurityModule {}
// export class SecurityModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(cookieParser)
//       .forRoutes('security');
//   }
// }