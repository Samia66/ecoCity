import {
  Body,
  Controller,
  Post, Get, UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CurrentUser, Roles } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { RolesGuard } from './guards/roles.guard';
import { RoleName } from '@prisma/client';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly service: AuthService,
  ) { }

  @Post('register')
  register(
    @Body() dto: RegisterDto,
  ) {
    return this.service.register(dto);
  }

  @Post('login')
  login(
    @Body() dto: LoginDto,
  ) {
    return this.service.login(dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(
    @CurrentUser() user: JwtPayloadDto,
  ) {
    return user;
  }


  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(
    @CurrentUser() user: JwtPayloadDto,
  ) {
    return this.service.logout(
      user.sub,
    );
  }


  @Get('admin')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(RoleName.ADMIN)
  admin() {
    return {
      message: 'Admin only',
    };
  }

}