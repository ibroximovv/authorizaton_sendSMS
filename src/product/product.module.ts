import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './entities/product.entity';
import { Order, OrderSchema } from './entities/order.entity';
import { AuthUser, AuthUserSchema } from 'src/auth/entities/auth.entity';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [MongooseModule.forFeature([{name: Product.name, schema: ProductSchema}, {name: Order.name, schema: OrderSchema}, {name: AuthUser.name, schema: AuthUserSchema}])],
  controllers: [ProductController],
  providers: [ProductService, MailService],
})
export class ProductModule {}
