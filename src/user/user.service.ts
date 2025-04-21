import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthUser } from 'src/auth/entities/auth.entity';

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

  async findAll() {
    try {
      return await this.user.find();
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
