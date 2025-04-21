import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { SenOtpAuthDto } from './dto/send-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
  @Post('send-otp')
  sendOtp(@Body() senOtpAuthDto: SenOtpAuthDto) {
    return this.authService.sendOtp(senOtpAuthDto)
  }
  
  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('login') 
  login(@Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.login(updateAuthDto)
  }
}
