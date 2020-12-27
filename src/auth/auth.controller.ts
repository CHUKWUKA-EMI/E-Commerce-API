import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body(ValidationPipe) credentials: LoginUserDto) {
    return this.authService.loginUser(credentials);
  }
}
