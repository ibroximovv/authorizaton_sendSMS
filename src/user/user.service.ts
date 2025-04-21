import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthUser } from 'src/auth/entities/auth.entity';
import { GetUserDto } from './dto/get-auth.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(AuthUser.name) private readonly user: Model<AuthUser>){}

  async findUser(username: string) {
    try {
      return await this.user.findOne({username: username})
    } catch (error) {
      console.log(error);
      return error
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const findOne = await this.findUser(createUserDto.username)
      if(findOne) {
        return {message: 'User already exists'}
      }
      return await this.user.create(createUserDto);
    } catch (error) {
      throw new InternalServerErrorException('Internal server error')
    }
  }

  async findAll(query: GetUserDto) {
    try {
      const { search, page = 1, limit = 10, order = 'desc', column = 'name'} = query;
      interface IFilterObj {
        name?: {$regex: string, $options: string},
        email?: {$regex: string, $options: string}
      }

      let filter: IFilterObj = {}

      if (column == "name" && search) {
        filter.name = { $regex: search, $options: 'i' }
      }

      if (column == "email" && search) {
        filter.email = { $regex: search, $options: 'i' }
      }

      return await this.user.find().sort({[column]: order === 'asc' ? 1 : -1 }).limit(limit).skip((page - 1) * limit);
    } catch (error) {
      throw new InternalServerErrorException('Internal server error')
    }
  }

  async findOne(id: string) {
    try {
      const findOne = await this.user.findById(id)
      if (!findOne) {
        return {message: 'User not found'}
      }
      return findOne
    } catch (error) {
      throw new InternalServerErrorException('Internal server error')
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const findOne = await this.user.findById(id)
      if (!findOne) {
        return {message: 'User not found'}
      }
      return this.user.findByIdAndUpdate(id, updateUserDto, {new: true});
    } catch (error) {
      throw new InternalServerErrorException('Internal server error')
    }
  }

  async remove(id: string) {
    try {
      const findOne = await this.user.findById(id)
        if (!findOne) {
          return {message: 'User not found'}
        }
      return await this.user.findByIdAndDelete(id);
    } catch (error) {
      throw new InternalServerErrorException('Internal server error')
    }
  }
}
