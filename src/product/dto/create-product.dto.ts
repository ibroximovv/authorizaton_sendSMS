import { ApiProperty } from "@nestjs/swagger"
import { IsMongoId, IsNumber, IsString } from "class-validator"

export class CreateProductDto {
    @ApiProperty()
    @IsString()
    name: string

    @ApiProperty()
    @IsNumber()
    price: number

    @ApiProperty()
    @IsString()
    image: string
}
