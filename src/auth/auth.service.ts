import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { AuthUser } from './entities/auth.entity';
import { Model } from 'mongoose';
import * as bcrypt from "bcrypt";
import { MailService } from 'src/mail/mail.service';
import { totp } from "otplib";
import { SmsService } from 'src/sms/sms.service';
import { SenOtpAuthDto } from './dto/send-otp.dto';
import { JwtService } from '@nestjs/jwt';

totp.options = {
  step: 300
}

@Injectable()
export class AuthService {
  constructor(@InjectModel(AuthUser.name) private readonly authUser: Model<AuthUser>, private readonly sendSmsToEmail: MailService, private readonly sendSmsToPhone: SmsService, private readonly jwt: JwtService){}
  async findUser(username: string) {
    return await this.authUser.findOne({ username })
  }

  async sendOtp(sendOtpAuthDto: SenOtpAuthDto) {
    try {
      const otp = totp.generate(sendOtpAuthDto.email + 'secret1')
      this.sendSmsToEmail.sendSmsToEmail(sendOtpAuthDto.email, 'Tasdiqlash kodi', 'Iltimos kodni hech kimga bermang', `<h2>${otp}</h2>`)
      // this.sendSmsToPhone.sendSmsToPhone(sendOtpAuthDto.phoneNumber, otp)
      return { message: 'otp sent'}
    } catch (error) {
      console.log(error);
    }
  }

  async register(createAuthDto: CreateAuthDto) {
    const findUser = await this.findUser(createAuthDto.username)
    if (findUser) {
      throw new NotFoundException('User already exists')
    }

    const hashedPassword = bcrypt.hashSync(createAuthDto.password, 10)

    const chackOtp = totp.verify({token: createAuthDto.otp, secret: createAuthDto.email + 'secret1'})
    if(!chackOtp) {
      throw new UnauthorizedException('Otp not provided')
    }

    const createNewAuthUser = await this.authUser.create({
      ...createAuthDto,
      password: hashedPassword
    })

    return createNewAuthUser;
  }

  async login(updateAuthDto: any) {
    try {
      const findUser = await this.findUser(updateAuthDto.username)
      if (!findUser) {
        throw new NotFoundException('User not exists')
      }

      const matchPassword = bcrypt.compareSync(updateAuthDto.password, findUser.password)
      if(!matchPassword) {
        throw new UnauthorizedException('password wrong error')
      }

      this.sendSmsToEmail.sendSmsToEmail(updateAuthDto.email, 'new logined', `date: ${new Date()}`)
      const token = this.jwt.sign({ id: findUser._id, role: findUser.role })
      
      return { token }
    } catch (error) {
      throw new InternalServerErrorException('Internal server error')
    }
  }

}
