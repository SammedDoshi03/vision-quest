import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import { AppModule } from '../src/app.module';

async function generate() {
  const app = await NestFactory.create(AppModule, { logger: false });

  const config = new DocumentBuilder()
    .setTitle('Enterprise Multi-Vertical Mobile BFF API')
    .setDescription(
      'Unified Backend-For-Frontend gateway orchestrating mobile APIs across Medical Adherence, E-Commerce, Streaming, Payments, Banking, Energy, and GovTech.'
    )
    .setVersion('1.0.0')
    .addTag('Medical', 'Elderly chronic care adherence, caregiver pairing, and alarms')
    .addTag('Feed', 'Anti-swipe resonance feed orchestration')
    .addTag('Scenes', 'Physical micro-events and venues')
    .addTag('Interactions', 'Mutual resonance waves and quests')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // 1. Write Swagger OpenAPI 3.0 JSON to monorepo root
  const rootDir = path.resolve(__dirname, '../../..');
  const openApiPath = path.join(rootDir, 'swagger-spec.json');
  fs.writeFileSync(openApiPath, JSON.stringify(document, null, 2));
  console.log(`[OpenAPI] Written to ${openApiPath}`);

  // 2. Generate Postman Collection v2.1.0 format
  const postmanItems: any[] = [];

  for (const [routePath, methods] of Object.entries(document.paths)) {
    for (const [httpMethod, operation] of Object.entries(methods as Record<string, any>)) {
      const tag = operation.tags?.[0] || 'Default';
      postmanItems.push({
        name: operation.summary || `${httpMethod.toUpperCase()} ${routePath}`,
        request: {
          method: httpMethod.toUpperCase(),
          header: [
            { key: 'Accept', value: 'application/json' },
            { key: 'Content-Type', value: 'application/json' },
            { key: 'Authorization', value: 'Bearer {{JWT_TOKEN}}' },
            { key: 'x-client-platform', value: 'ios' },
            { key: 'x-client-version', value: '1.0.0' },
          ],
          url: {
            raw: `{{BASE_URL}}${routePath}`,
            host: ['{{BASE_URL}}'],
            path: routePath.split('/').filter(Boolean),
          },
          description: operation.description,
        },
      });
    }
  }

  const postmanCollection = {
    info: {
      name: 'Resonance Multi-Vertical BFF API Collection',
      description: 'Ready-to-import Postman collection for testing all BFF endpoints directly',
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    },
    variable: [
      { key: 'BASE_URL', value: 'http://localhost:4000' },
      { key: 'JWT_TOKEN', value: 'sample_jwt_access_token' },
    ],
    item: postmanItems,
  };

  const postmanPath = path.join(rootDir, 'postman-collection.json');
  fs.writeFileSync(postmanPath, JSON.stringify(postmanCollection, null, 2));
  console.log(`[Postman] Written to ${postmanPath}`);

  await app.close();
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
