import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { ErrorExceptionFilter, HttpExceptionFilter } from "./exception.filter";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({
    transform:true,
    stopAtFirstError: true,
    exceptionFactory: (errors) => {
      const errorsForResponse = [];
      errors.forEach(e => {
        Object.keys(e.constraints).forEach(key => {
          errorsForResponse.push({ field: e.property, message:e.constraints[key] })
        })
      });
      throw new BadRequestException(errorsForResponse);
    }
  }));
  app.useGlobalFilters(new ErrorExceptionFilter(), new HttpExceptionFilter());
  const configService = app.get(ConfigService)
  await app.listen(configService.get('PORT'));
  //await app.listen(3000);
}

bootstrap();
