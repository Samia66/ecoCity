import {
  Body,
  Controller,
  Post, Get, UseGuards,
  Delete,
  Param,
  Patch
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CurrentUser, Roles } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { RolesGuard } from './guards/roles.guard';
import { RoleName } from '@prisma/client';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { ChangePasswordDto } from './dto/change-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Authentication')
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
    @CurrentUser()
    user: JwtPayloadDto,
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

  @Post('refresh')
  refresh(
    @Body()
    dto: RefreshTokenDto,
  ) {
    return this.service.refresh(dto);
  }


  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  logoutAllDevices(
    @CurrentUser()
    user: JwtPayloadDto,
  ) {
    return this.service.logoutAllDevices(
      user.sub,
    );
  }

  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  sessions(
    @CurrentUser()
    user: JwtPayloadDto,
  ) {
    return this.service.sessions(
      user.sub,
    );
  }

  @Delete('sessions/:id')
  @UseGuards(JwtAuthGuard)
  logoutSession(
    @Param('id')
    id: string,
  ) {
    return this.service.logoutSession(id);
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  changePassword(
    @CurrentUser()
    user: JwtPayloadDto,

    @Body()
    dto: ChangePasswordDto,
  ) {
    return this.service.changePassword(
      user.sub,
      dto,
    );
  }


  @Post('verify-email')
  verifyEmail(
    @Body()
    dto: VerifyEmailDto,
  ) {
    return this.service.verifyEmail(
      dto,
    );
  }


  @Post('resend-verification')
  resendVerification(
    @Body()
    dto: ResendVerificationDto,
  ) {
    return this.service.resendVerificationEmail(
      dto,
    );
  }


  @Post('forgot-password')
  forgotPassword(
    @Body()
    dto: ForgotPasswordDto,
  ) {
    return this.service.forgotPassword(
      dto,
    );
  }


  @Post('reset-password')
  resetPassword(
    @Body()
    dto: ResetPasswordDto,
  ) {
    return this.service.resetPassword(
      dto,
    );
  }
}