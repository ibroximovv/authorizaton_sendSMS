import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsPhoneNumber, IsString } from "class-validator"

export class SenOtpAuthDto {
    @ApiProperty()
    @IsEmail()
    email: string
    @ApiProperty()
    @IsPhoneNumber()
    phoneNumber: string
}
