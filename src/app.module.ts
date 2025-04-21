import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailModule } from './mail/mail.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { SmsService } from './sms/sms.service';
import { MulterController } from './multer/multer.controller';
import { ProductModule } from './product/product.module';

@Module({
  imports: [MailModule, UserModule, MongooseModule.forRoot('mongodb://localhost/nest-homework13'), AuthModule, ProductModule],
  controllers: [AppController, MulterController],
  providers: [AppService, SmsService],
})
export class AppModule {}