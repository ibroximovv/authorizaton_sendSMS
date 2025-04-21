import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthorizaitonGuard } from 'src/authorization/authorization.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthUser, AuthUserSchema } from 'src/auth/entities/auth.entity';

@Module({
  imports: [MongooseModule.forFeature([{name: AuthUser.name, schema: AuthUserSchema}])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
