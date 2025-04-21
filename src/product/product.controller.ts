import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RolesDecorator } from 'src/common/role.decorator';
import { Role } from 'src/common/role.enum';
import { AuthorizaitonGuard } from 'src/authorization/authorization.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Request } from 'express';
import { OrderProductDto } from './dto/order-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @RolesDecorator(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthorizaitonGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto, @Req() req: Request) {
    return this.productService.create(createProductDto, req);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @RolesDecorator(Role.ADMIN, Role.SUPERADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthorizaitonGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @RolesDecorator(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthorizaitonGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @RolesDecorator(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthorizaitonGuard)
  @Post('order')
  order(@Body() orderProductDto: OrderProductDto, @Req() req: Request) {
    return this.productService.order(orderProductDto, req);
  }
}


