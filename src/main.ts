import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true
    })
  )

  // Swagger Configurations
  const options = new DocumentBuilder()
    .setTitle("Empro Backend")
    .setDescription("Empro API Documentation")
    .setVersion("1.0")
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('/api-docs',app, document)
  

  await app.listen(3000);
}
bootstrap();
