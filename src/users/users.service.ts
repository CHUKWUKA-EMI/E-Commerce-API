import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config();

const { JWT_SECRET } = process.env;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async sendEmail(from, to, subject, html) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    try {
      return await sgMail.send({ to, subject, from, html });
    } catch (error) {
      if (error) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();

    const existingUser = await this.usersRepository.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new HttpException(
        'User with this email already exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.email = createUserDto.email;
    user.password = await bcrypt.hash(createUserDto.password, 10);
    user.country = createUserDto.country;
    user.state = createUserDto.state;
    try {
      const newUser = await this.usersRepository.save(user);
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });
      const url = `${process.env.BACKEND_URL}/users/activate-user/${token}`;
      const message = `<html><body><h3> Hi ${createUserDto.firstName} ${createUserDto.lastName} </h3>
    <p>Thank you for registering on this platform</p>
    <hr/>
    <b><h2>Please Verify your email to complete the registration process</h2></b>
		<a style="
				padding: 1em 1.5em;
        text-decoration: none;
        font-weight:bold;
        text-transform: capitalize;" href="${url}">Verify Email</a></body></html>`;

      await this.sendEmail(
        `Developer-Justice <pistischaris494@gmail.com>`,
        createUserDto.email,
        'Activate Your Account',
        message,
      );

      return newUser;
    } catch (error) {
      if (error) {
        console.log('error', error);
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async activateEmail(token: string): Promise<boolean> {
    try {
      const { id } = jwt.verify(token, JWT_SECRET);
      if (!id) {
        throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
      }
      const user = await this.usersRepository.findOne(id);
      if (!user) {
        throw new HttpException(
          "User's details no longer available. Try and register again",
          HttpStatus.NOT_FOUND,
        );
      }
      await this.usersRepository.update(user.id, { isActive: true });
      return true;
    } catch (error) {
      if (error) {
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return await this.usersRepository.findOne(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    user.firstName = updateUserDto.firstName;
    user.lastName = updateUserDto.lastName;
    user.email = updateUserDto.email;
    user.country = updateUserDto.country;
    user.state = updateUserDto.state;
    user.imageUrl = updateUserDto.imageUrl;

    return await this.usersRepository.save(user);
  }

  async remove(id: number): Promise<string> {
    await this.usersRepository.delete(id);
    return `User with id ${id} updated successfully`;
  }
}
