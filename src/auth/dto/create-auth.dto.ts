import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsEnum, IsPhoneNumber, IsString } from "class-validator"
import { Role } from "src/common/role.enum"

export class CreateAuthDto {
    @ApiProperty()
    @IsString()
    otp: string

    @ApiProperty()
    @IsString()
    username: string

    @ApiProperty()
    @IsEmail()
    email: string

    @ApiProperty()
    @IsPhoneNumber()
    phoneNumber: string

    @ApiProperty()
    @IsString()
    password: string

    @ApiProperty({ enum: Role })
    @IsEnum(Role)
    role: string
}
