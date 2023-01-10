import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import firebase from 'firebase/compat/app'
import firestore from './utils/firebase';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
