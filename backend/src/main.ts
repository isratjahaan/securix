import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('CentralCommandBootstrap');
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    },
  });

  // Global API Prefix
  app.setGlobalPrefix('api');

  // Input validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // OpenAPI / Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('SIS CYBER FORTRESS — Enterprise Command API')
    .setDescription(
      'Comprehensive Central Command REST APIs controlling all 12 cybersecurity ecosystem modules, SOC operations, forensic telemetry and identity governance.',
    )
    .setVersion('3.0.0-ENTERPRISE')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);

  logger.log(`========================================================================`);
  logger.log(`🛡️  SIS CYBER FORTRESS — CENTRAL COMMAND BACKEND ONLINE`);
  logger.log(`📡  REST API Gateway:      http://localhost:${port}/api`);
  logger.log(`📚  OpenAPI Swagger Docs:   http://localhost:${port}/api/docs`);
  logger.log(`⚡  Socket.IO SOC Stream:   http://localhost:${port}/socket.io`);
  logger.log(`========================================================================`);
}
bootstrap();
