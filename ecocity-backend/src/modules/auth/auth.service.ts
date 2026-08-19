import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AppConfig } from '../../config/configuration';
import { comparePassword, hashPassword } from '../../common/utils/hash.util';
import { generateOpaqueToken, hashToken } from '../../common/utils/token.util';
import { RoleName } from '../../common/constants/roles.constant';
import { AuthMapper, AuthUserDto } from './auth.mapper';
import { AuthRepository, UserWithRoleAndOrg } from './auth.repository';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { StringValue } from 'ms';

export interface AuthTokensDto {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponseDto extends AuthTokensDto {
  user: AuthUserDto;
}

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;
const REFRESH_TOKEN_EXPIRY_DAYS = 7;
const RESET_TOKEN_EXPIRY_MINUTES = 30;
const VERIFICATION_TOKEN_EXPIRY_HOURS = 48;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly appConfig: AppConfig;

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly authMapper: AuthMapper,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.appConfig = this.configService.get<AppConfig>('app')!;
  }

  async login(dto: LoginDto, meta: { ip?: string; userAgent?: string } = {}): Promise<LoginResponseDto> {
    const user = await this.authRepository.findUserByEmail(dto.email.toLowerCase().trim());

    if (!user) {
      throw new UnauthorizedException('Identifiants invalides.');
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
      throw new UnauthorizedException(
        `Compte temporairement verrouillé suite à plusieurs échecs. Réessayez dans ${minutesLeft} min.`,
      );
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Ce compte est désactivé. Contactez un administrateur.');
    }

    const passwordMatches = await comparePassword(dto.password, user.password);
    if (!passwordMatches) {
      await this.handleFailedLogin(user);
      throw new UnauthorizedException('Identifiants invalides.');
    }

    await this.authRepository.recordSuccessfulLogin(user.id);

    const tokens = await this.issueTokens(user, meta);
    return { ...tokens, user: this.authMapper.toAuthUser(user) };
  }

  async register(dto: RegisterDto): Promise<LoginResponseDto> {
    const existing = await this.authRepository.findUserByEmail(dto.email.toLowerCase().trim());
    if (existing) {
      throw new ConflictException('Un compte existe déjà avec cette adresse email.');
    }

    const citizenRole = await this.authRepository.findDefaultRoleByName(RoleName.CITIZEN);
    if (!citizenRole) {
      throw new NotFoundException(
        "Le rôle CITOYEN n'est pas configuré. Lancez le seed avant d'ouvrir les inscriptions.",
      );
    }

    let organizationId = dto.organizationId;
    if (!organizationId) {
      const defaultOrg = await this.authRepository.findDefaultOrganization();
      if (!defaultOrg) {
        throw new NotFoundException("Aucune organisation n'est configurée sur la plateforme.");
      }
      organizationId = defaultOrg.id;
    }

    const hashedPassword = await hashPassword(dto.password, this.appConfig.bcryptSaltRounds);

    const user = await this.authRepository.createUser({
      firstName: dto.firstName.trim(),
      lastName: dto.lastName.trim(),
      email: dto.email.toLowerCase().trim(),
      password: hashedPassword,
      organization: { connect: { id: organizationId } },
      role: { connect: { id: citizenRole.id } },
    });

    const tokens = await this.issueTokens(user);
    return { ...tokens, user: this.authMapper.toAuthUser(user) };
  }

  async refresh(rawToken: string, meta: { ip?: string; userAgent?: string } = {}): Promise<AuthTokensDto> {
    const tokenHash = hashToken(rawToken);
    const stored = await this.authRepository.findRefreshTokenByHash(tokenHash);

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Session expirée, veuillez vous reconnecter.');
    }

    // Rotation : on révoque l'ancien token dès qu'il est utilisé.
    const tokens = await this.issueTokens(stored.user, meta);
    await this.authRepository.revokeRefreshToken(stored.id, hashToken(tokens.refreshToken));

    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.authRepository.revokeAllUserRefreshTokens(userId);
  }

  async getProfile(userId: string): Promise<AuthUserDto> {
    const user = await this.authRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }
    return this.authMapper.toAuthUser(user);
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.authRepository.findUserByEmail(dto.email.toLowerCase().trim());

    // Toujours répondre avec succès (ne pas révéler si l'email existe).
    if (!user) {
      return { message: 'Si ce compte existe, un email de réinitialisation a été envoyé.' };
    }

    const { token, hash } = generateOpaqueToken();
    await this.authRepository.createPasswordResetToken({
      user: { connect: { id: user.id } },
      tokenHash: hash,
      expiresAt: new Date(Date.now() + RESET_TOKEN_EXPIRY_MINUTES * 60_000),
    });

    // TODO(email): brancher un provider transactionnel (SendGrid/SES/Resend).
    this.logger.log(`[DEV] Lien de réinitialisation pour ${user.email} : token=${token}`);

    return { message: 'Si ce compte existe, un email de réinitialisation a été envoyé.' };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const tokenHash = hashToken(dto.token);
    const record = await this.authRepository.findPasswordResetTokenByHash(tokenHash);

    if (!record) {
      throw new UnauthorizedException('Lien de réinitialisation invalide ou expiré.');
    }

    const hashedPassword = await hashPassword(dto.password, this.appConfig.bcryptSaltRounds);
    await this.authRepository.updateUser(record.userId, {
      password: hashedPassword,
      mustChangePassword: false,
    });
    await this.authRepository.markPasswordResetTokenUsed(record.id);
    await this.authRepository.revokeAllUserRefreshTokens(record.userId);

    return { message: 'Mot de passe réinitialisé avec succès.' };
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<{ message: string }> {
    const user = await this.authRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    const matches = await comparePassword(dto.currentPassword, user.password);
    if (!matches) {
      throw new UnauthorizedException('Mot de passe actuel incorrect.');
    }

    const hashedPassword = await hashPassword(dto.newPassword, this.appConfig.bcryptSaltRounds);
    await this.authRepository.updateUser(userId, { password: hashedPassword, mustChangePassword: false });

    return { message: 'Mot de passe mis à jour avec succès.' };
  }

  async sendVerificationEmail(userId: string): Promise<{ message: string }> {
    const user = await this.authRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    const { token, hash } = generateOpaqueToken();
    await this.authRepository.createEmailVerificationToken({
      user: { connect: { id: user.id } },
      tokenHash: hash,
      expiresAt: new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY_HOURS * 3_600_000),
    });

    this.logger.log(`[DEV] Lien de vérification pour ${user.email} : token=${token}`);
    return { message: 'Email de vérification envoyé.' };
  }

  async verifyEmail(dto: VerifyEmailDto): Promise<{ message: string }> {
    const tokenHash = hashToken(dto.token);
    const record = await this.authRepository.findEmailVerificationTokenByHash(tokenHash);

    if (!record) {
      throw new UnauthorizedException('Lien de vérification invalide ou expiré.');
    }

    await this.authRepository.updateUser(record.userId, {
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    });
    await this.authRepository.markEmailVerificationTokenUsed(record.id);

    return { message: 'Adresse email vérifiée avec succès.' };
  }

  // --------------------------------------------------------------------

  private async handleFailedLogin(user: UserWithRoleAndOrg): Promise<void> {
    const attempts = user.failedLoginAttempts + 1;
    const lockedUntil =
      attempts >= MAX_FAILED_ATTEMPTS ? new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60_000) : null;

    await this.authRepository.incrementFailedAttempts(user.id, attempts, lockedUntil);
  }

private async issueTokens(
  user: UserWithRoleAndOrg,
  meta: { ip?: string; userAgent?: string } = {},
): Promise<AuthTokensDto> {
  const payload = {
    sub: user.id,
    ...this.authMapper.toJwtPayload(user),
  };

  const accessToken = await this.jwtService.signAsync(payload, {
    secret: this.appConfig.jwt.accessSecret,
    expiresIn: this.appConfig.jwt.accessExpiresIn as StringValue,
  });

  const { token: refreshToken, hash } = generateOpaqueToken();

  await this.authRepository.createRefreshToken({
    user: { connect: { id: user.id } },
    tokenHash: hash,
    expiresAt: new Date(
      Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 3_600_000,
    ),
    createdByIp: meta.ip,
    userAgent: meta.userAgent,
  });

  return { accessToken, refreshToken };
}
}
