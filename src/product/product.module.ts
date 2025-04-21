import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './entities/product.entity';
import { Order, OrderSchema } from './entities/order.entity';

@Module({
  imports: [MongooseModule.forFeature([{name: Product.name, schema: ProductSchema}, {name: Order.name, schema: OrderSchema}])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
