import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './entities/product.entity';
import { Model } from 'mongoose';
import { Request } from 'express';
import { OrderProductDto } from './dto/order-product.dto';
import { Order, OrderDocument } from './entities/order.entity';
import { MailService } from 'src/mail/mail.service';
import { AuthUser } from 'src/auth/entities/auth.entity';
import { GetProductDto } from './dto/get-product.dto';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private readonly product: Model<Product>, @InjectModel(Order.name) private readonly orders: Model<Order>, @InjectModel(AuthUser.name) private readonly user: Model<AuthUser>, private readonly mail: MailService){}
  async create(createProductDto: CreateProductDto , req: Request) {
    try {
      return await this.product.create({
        ...createProductDto,
        authUser: req['user_id']
      });
    } catch (error) {
      throw new InternalServerErrorException('Internal server error')
    }
  }

  async findAll(query: GetProductDto) {
    try {
      const { search, page = 1, limit = 10, order = 'desc', column = 'name'} = query;
      interface IFilterObj {
        name?: {$regex: string, $options: string},
        price?: {$regex: string, $options: string},
        authUser?: {$regex: string, $options: string}
      }

      let filter: IFilterObj = {}

      if (column == "name" && search) {
        filter.name = { $regex: search, $options: 'i' }
      }

      if (column == "price" && search) {
        filter.price = { $regex: search, $options: 'i' }
      }

      if (column == "authUser" && search) {
        filter.authUser = { $regex: search, $options: 'i' }
      }

      return await this.product.find().populate('authUser').sort({[column]: order === 'asc' ? 1 : -1 }).limit(limit).skip((page - 1) * limit);
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
      const createdOrders: OrderDocument[] = [];

      for (const productId of createOrderdto.productId) {
        const ord = await this.orders.create({
          authUser: userId,
          products: productId, 
        });
        
        createdOrders.push(ord);
      }

      const findUser = await this.user.findById(userId)
      this.mail.sendSmsToEmail(`${findUser?.email}`, 'new ordered', 'asdasd')

      return createdOrders;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Internal server error')
    }
  }

  async getOrder() {
    try {
      const nima = await this.orders.find().populate('products').populate('authUser')
      
      return nima
    } catch (error) {
      console.log('nima', error.message);
      throw new InternalServerErrorException('Internal server error')
    }
  }
}
