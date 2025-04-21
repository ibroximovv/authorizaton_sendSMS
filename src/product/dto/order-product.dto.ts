import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsMongoId } from "class-validator";

export class OrderProductDto {
    @ApiProperty()
    @IsArray()
    productId: string[]
}