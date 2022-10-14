import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Our app is running on port ${PORT}`);
  });
}
bootstrap();
