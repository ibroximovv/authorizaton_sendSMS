import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/common/role.enum';

export type AuthUserDocument = HydratedDocument<AuthUser>;

@Schema()
export class AuthUser {
  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  role: Role;
}

export const AuthUserSchema = SchemaFactory.createForClass(AuthUser);
