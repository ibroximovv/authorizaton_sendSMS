import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MailService } from 'src/mail/mail.service';
import { SmsService } from 'src/sms/sms.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthUser, AuthUserSchema } from './entities/auth.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [MongooseModule.forFeature([{name: AuthUser.name, schema: AuthUserSchema}]), JwtModule.register({
    secret: 'nimadir',
    global: true
  })],
  controllers: [AuthController],
  providers: [AuthService, MailService, SmsService],
})
export class AuthModule {}
