import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(user: any) {
    try {
      const payload = { username: user.email, sub: user.id };
      return {
        user: user,
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async loginUser(credentials: LoginUserDto) {
    try {
      const user = await this.userRepo.findOne({
        where: { email: credentials.email },
      });
      if (!user) {
        throw new HttpException('Email not found', HttpStatus.NOT_FOUND);
      }
      const isValidPass = await bcrypt.compare(
        credentials.password,
        user.password,
      );
      if (!isValidPass) {
        throw new UnauthorizedException(
          'User unauthorized. Please provide valid credentials',
        );
      }
      if (!user.isActive) {
        throw new HttpException(
          'Email has not been activated. Please verify your email and',
          HttpStatus.FORBIDDEN,
        );
      }

      return this.login(user);
    } catch (error) {
      if (error.statusCode == 500) {
        throw new HttpException(
          'Sorry, something went wrong',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(error, HttpStatus.UNAUTHORIZED);
    }
  }
}
