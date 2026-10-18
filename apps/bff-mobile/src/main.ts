import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Swagger OpenAPI 3.0 Documentation Setup
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
  SwaggerModule.setup('api/docs', app, document);

  // Persist swagger-spec.json for external tools (Postman, Insomnia)
  try {
    const specPath = path.join(process.cwd(), 'swagger-spec.json');
    fs.writeFileSync(specPath, JSON.stringify(document, null, 2));
  } catch (err) {
    console.warn('[Swagger] Could not write swagger-spec.json:', err);
  }

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`[Enterprise BFF] Running on http://localhost:${port}`);
  console.log(`[Swagger Docs] Available at http://localhost:${port}/api/docs`);
}

if (require.main === module) {
  bootstrap();
}

export { bootstrap };
