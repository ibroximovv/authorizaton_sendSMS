import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './entities/product.entity';
import { Model } from 'mongoose';
import { Request } from 'express';
import { OrderProductDto } from './dto/order-product.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private readonly product: Model<Product>, @InjectModel(Order.name) private readonly orders: Model<Order>){}
  async create(createProductDto: CreateProductDto , req: Request) {
    try {
      return await this.product.create({
        createProductDto,
        authUser: req['user_id']
      });
    } catch (error) {
      throw new InternalServerErrorException('Internal server error')
    }
  }

  async findAll() {
    try {
      return await this.product.find();
    } catch (error) {
      throw new InternalServerErrorException('Internal server error')
    }
  }

  async findOne(id: string) {
    try {
      const findOne = await this.product.findById(id)
      if (!findOne) {
        return { message: 'Product not found' }
      }
      return findOne;
    } catch (error) {
      throw new InternalServerErrorException('Internal server error')
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const findOne = await this.product.findById(id)
      if (!findOne) {
        return { message: 'Product not found' }
      }
      return await this.product.findByIdAndUpdate(id, updateProductDto, {new: true});
    } catch (error) {
      throw new InternalServerErrorException('Internal server error')
    }
  }

  async remove(id: string) {
    try {
      const findOne = await this.product.findById(id)
      if (!findOne) {
        return { message: 'Product not found' }
      }
      return await this.product.findByIdAndDelete(id);
    } catch (error) {
      throw new InternalServerErrorException('Internal server error')
    }
  }

  async order(createOrderdto: OrderProductDto, req: Request) {
    try {
      const userId = req['user_id'];
      const createdOrders = [];

      for (const productId of createOrderdto.productId) {
        const ord = await this.orders.create({
          authUser: userId,
          products: productId, 
        });
        console.log(ord);
        
        // createdOrders.push(ord);
      }
      return createdOrders;
    } catch (error) {
      throw new InternalServerErrorException('Internal server error')
    }
  }
}
