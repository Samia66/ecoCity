import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import { RoleName } from '@prisma/client';
import { AuthRepository } from './repositories/auth.repository';
import { HashService } from 'src/common/services/hash.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDto } from './dto/response/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { AuthMapper } from './mappers/auth.mapper';
import { randomBytes } from 'crypto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { ChangePasswordDto } from './dto/change-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailService } from 'src/common/communication/mail/mail.service';
import { AUTH_ERRORS } from './constants/users.constants';
import { DEFAULT_ROLE } from './constants/auth.roles';
import { AUTH_CONFIG } from './constants/auth.config';


@Injectable()
export class AuthService {
    constructor(
        private readonly repository: AuthRepository,
        private readonly hashService: HashService,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService,
    ) { }



    // Register method
    async register(
        dto: RegisterDto,
    ): Promise<AuthResponseDto> {

        await this.validateRegistration(dto);

        const user =
            await this.createCitizen(dto);

        return this.createAuthentication(user);
    }

    // Login method
    async login(
        dto: LoginDto,
    ): Promise<AuthResponseDto> {

        const user =
            await this.validateLogin(dto);

        return this.createAuthentication(
            user,
        );
    }

    // Refresh token method
    async refresh(
        dto: RefreshTokenDto,
    ): Promise<AuthResponseDto> {

        const storedToken =
            await this.findMatchingRefreshToken(
                dto.refreshToken,
            );

        if (!storedToken) {
            throw new UnauthorizedException(
                'Invalid refresh token',
            );
        }

        await this.repository.revokeRefreshToken(
            storedToken.id,
        );

        const accessToken =
            await this.generateAccessToken({
                sub: storedToken.user.id,
                role: storedToken.user.role.name,
                organizationId:
                    storedToken.user.organizationId,
            });

        const refreshToken =
            this.generateRefreshToken();

        await this.saveRefreshToken(
            refreshToken,
            storedToken.user.id,
        );

        const verificationToken =
            await this.generateVerificationToken();

        await this.saveVerificationToken(
            verificationToken,
            storedToken.user.id,
        );

        return AuthMapper.toAuthResponse(
            storedToken.user,
            accessToken,
            refreshToken,
        );
    }

    // Logout method
    async logout(userId: string) {
        await this.repository.revokeAllRefreshTokens(
            userId,
        );

        return {
            message: 'Logged out successfully',
        };
    }

    // Logout from all devices method
    async logoutAllDevices(
        userId: string,
    ) {
        await this.repository.revokeAllRefreshTokens(
            userId,
        );

        return {
            message:
                'Logged out from all devices successfully',
        };
    }

    // Change password method   
    async changePassword(
        userId: string,
        dto: ChangePasswordDto,
    ) {

        const user =
            await this.repository.findUserById(
                userId,
            );

        if (!user) {
            throw new UnauthorizedException(
                'User not found',
            );
        }

        const valid =
            await this.hashService.compare(
                dto.currentPassword,
                user.password,
            );

        if (!valid) {
            throw new UnauthorizedException(
                'Current password is incorrect',
            );
        }

        const samePassword =
            await this.hashService.compare(
                dto.newPassword,
                user.password,
            );

        if (samePassword) {
            throw new BadRequestException(
                'New password must be different from current password',
            );
        }

        const passwordHash =
            await this.hashService.hash(
                dto.newPassword,
            );

        await this.repository.updatePassword(
            user.id,
            passwordHash,
        );

        await this.repository.revokeAllRefreshTokens(
            user.id,
        );

        return {
            message:
                'Password changed successfully. Please login again.',
        };
    }

    // Save refresh token method
    private async saveRefreshToken(
        token: string,
        userId: string,
        userAgent?: string,
        ipAddress?: string,
        deviceName?: string,
    ) {
        const tokenHash =
            await this.hashService.hash(token);

        await this.repository.createRefreshToken({

            tokenHash,

            userAgent,

            ipAddress,

            deviceName,

            expiresAt: new Date(
                Date.now() +
                AUTH_CONFIG.REFRESH_TOKEN_DAYS,
            ),

            user: {
                connect: {
                    id: userId,
                },
            },
        });
    }

    async logoutSession(
        sessionId: string,
    ) {
        await this.repository.revokeSession(
            sessionId,
        );

        return {
            message:
                'Session disconnected successfully',
        };
    }

    async forgotPassword(
        dto: ForgotPasswordDto,
    ) {
        const user =
            await this.repository.findUserByEmail(
                dto.email,
            );

        /**
         * On ne révèle jamais
         * si l'utilisateur existe.
         */
        if (!user) {
            return {
                message:
                    'If an account exists, a reset email has been sent.',
            };
        }

        await this.repository.deletePasswordResetTokens(
            user.id,
        );

        const token =
            this.generatePasswordResetToken();

        await this.savePasswordResetToken(
            token,
            user.id,
        );

        // Plus tard :
        // await this.mailService.sendForgotPasswordEmail(...)

        return {
            message:
                'If an account exists, a reset email has been sent.',
        };
    }

    // Reset password method
    async resetPassword(
        dto: ResetPasswordDto,
    ) {

        const resetToken =
            await this.findMatchingPasswordResetToken(
                dto.token,
            );

        if (!resetToken) {
            throw new UnauthorizedException(
                'Invalid reset token',
            );
        }

        const passwordHash =
            await this.hashService.hash(
                dto.password,
            );

        await this.repository.updatePassword(
            resetToken.user.id,
            passwordHash,
        );

        await this.repository.usePasswordResetToken(
            resetToken.id,
        );

        await this.repository.revokeAllRefreshTokens(
            resetToken.user.id,
        );

        return {
            message:
                'Password reset successfully',
        };
    }



    /* ====================== */



    // Logout session method
    private async validateLogin(
        dto: LoginDto,
    ) {

        const user =
            await this.repository.findUserByEmailWithRelations(
                dto.email,
            );

        if (!user) {
            throw new UnauthorizedException(
                AUTH_ERRORS.INVALID_CREDENTIALS,
            );
        }

        const valid =
            await this.hashService.compare(
                dto.password,
                user.password,
            );

        if (!valid) {
            throw new UnauthorizedException(
                AUTH_ERRORS.INVALID_CREDENTIALS,
            );
        }

        return user;
    }

    // Validate registration method
    private async validateRegistration(
        dto: RegisterDto,
    ): Promise<void> {

        const existingUser =
            await this.repository.findUserByEmail(
                dto.email,
            );

        if (existingUser) {
            throw new BadRequestException(
                'Email already exists',
            );
        }

        const organization =
            await this.repository.findOrganizationByCode(
                dto.organizationCode,
            );

        if (!organization) {
            throw new BadRequestException(
                'Invalid organization',
            );
        }
    }

    // Create citizen method
    private async createCitizen(
        dto: RegisterDto,
    ) {

        const organization =
            await this.repository.findOrganizationByCode(
                dto.organizationCode,
            );

        const role =
            await this.repository.findRoleByName(
                DEFAULT_ROLE,
            );

        if (!role || !organization) {
            throw new BadRequestException();
        }

        const password =
            await this.hashService.hash(
                dto.password,
            );

        return this.repository.createUser({

            firstName: dto.firstName,

            lastName: dto.lastName,

            email: dto.email,

            phone: dto.phone,

            password,

            role: {
                connect: {
                    id: role.id,
                },
            },

            organization: {
                connect: {
                    id: organization.id,
                },
            },

        });

    }


    // Create authentication method
    private async createAuthentication(
        user: Awaited<
            ReturnType<AuthRepository['createUser']>
        >,
    ): Promise<AuthResponseDto> {

        const accessToken =
            await this.generateAccessToken({
                sub: user.id,
                role: user.role.name,
                organizationId:
                    user.organizationId,
            });

        const refreshToken =
            this.generateRefreshToken();

        await this.saveRefreshToken(
            refreshToken,
            user.id,
        );

        const verificationToken =
            this.generateVerificationToken();

        await this.saveVerificationToken(
            verificationToken,
            user.id,
        );

        await this.mailService.sendVerificationEmail(
            user.email,
            verificationToken,
        );

        return AuthMapper.toAuthResponse(
            user,
            accessToken,
            refreshToken,
        );
    }





    /* ====================== Token   ====================== */

    // Get user sessions method
    async sessions(
        userId: string,
    ) {
        return this.repository.findUserSessions(
            userId,
        );
    }

    // Generate refresh token method
    private generateRefreshToken(): string {
        return randomBytes(64).toString('hex');
    }

    // Generate verification token method
    private generateVerificationToken() {
        return randomBytes(64).toString('hex');
    }

    // Find matching refresh token method
    private async findMatchingRefreshToken(
        refreshToken: string,
    ) {
        const tokens =
            await this.repository.findValidRefreshTokens();

        for (const token of tokens) {

            const valid =
                await this.hashService.compare(
                    refreshToken,
                    token.tokenHash,
                );

            if (valid) {
                return token;
            }
        }

        return null;
    }

    // Email verification token methods
    private async saveVerificationToken(
        token: string,
        userId: string,
    ) {

        const tokenHash =
            await this.hashService.hash(token);

        await this.repository.createEmailVerificationToken({

            tokenHash,

            expiresAt: new Date(
                Date.now() +
                24 * 60 * 60 * 1000,
            ),

            user: {
                connect: {
                    id: userId,
                },
            },
        });
    }

    // Find matching email verification token method
    private async findMatchingVerificationToken(
        token: string,
    ) {

        const tokens =
            await this.repository.findValidEmailVerificationTokens();

        for (const item of tokens) {

            const valid =
                await this.hashService.compare(
                    token,
                    item.tokenHash,
                );

            if (valid) {
                return item;
            }
        }

        return null;
    }

    private async savePasswordResetToken(
        token: string,
        userId: string,
    ) {
        const tokenHash =
            await this.hashService.hash(token);

        await this.repository.createPasswordResetToken({
            tokenHash,

            expiresAt: new Date(
                Date.now() + 15 * 60 * 1000,
            ),

            user: {
                connect: {
                    id: userId,
                },
            },
        });
    }

    // Find matching password reset token method
    private async findMatchingPasswordResetToken(
        token: string,
    ) {
        const tokens =
            await this.repository.findValidPasswordResetTokens();

        for (const item of tokens) {

            const valid =
                await this.hashService.compare(
                    token,
                    item.tokenHash,
                );

            if (valid) {
                return item;
            }
        }

        return null;
    }



    // Generate access token method
    private async generateAccessToken(
        payload: JwtPayload,
    ): Promise<string> {
        return this.jwtService.signAsync(payload);
    }










    /* ====================== Email   ====================== */

    //
    async verifyEmail(
        dto: VerifyEmailDto,
    ) {

        const verification =
            await this.findMatchingVerificationToken(
                dto.token,
            );

        if (!verification) {
            throw new UnauthorizedException(
                'Invalid verification token',
            );
        }

        await this.repository.verifyEmailToken(
            verification.id,
        );

        await this.repository.verifyUserEmail(
            verification.user.id,
        );

        return {
            message:
                'Email verified successfully',
        };
    }


    // Resend email verification
    async resendVerificationEmail(
        dto: ResendVerificationDto,
    ) {

        const user =
            await this.repository.findUserByEmail(
                dto.email,
            );

        if (!user) {
            throw new BadRequestException(
                'User not found',
            );
        }

        if (user.emailVerified) {
            throw new BadRequestException(
                'Email already verified',
            );
        }

        await this.repository.deleteEmailVerificationTokens(
            user.id,
        );

        const token =
            this.generateVerificationToken();

        await this.saveVerificationToken(
            token,
            user.id,
        );

        // Plus tard
        return {
            message:
                'Verification email sent successfully',
        };
    }


    private generatePasswordResetToken(): string {
        return randomBytes(64).toString('hex');
    }





    /* ====================== Permissoon   ====================== */


    async validateJwtUser(
        payload: JwtPayload,
    ): Promise<JwtPayload> {

        const user =
            await this.repository.findUserPermissions(
                payload.sub,
            );

        if (!user) {
            throw new UnauthorizedException(
                AUTH_ERRORS.USER_NOT_FOUND,
            );
        }

        return {

            sub: user.id,

            role: user.role.name,

            organizationId:
                user.organizationId,

            permissions:
                user.role.rolePermissions.map(
                    rp => rp.permission.code,
                ),

        };
    }


}