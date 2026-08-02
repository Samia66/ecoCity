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


@Injectable()
export class AuthService {
    constructor(
        private readonly repository: AuthRepository,
        private readonly hashService: HashService,
        private readonly jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {

        const existingUser =
            await this.repository.findUserByEmail(dto.email);

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

        const role =
            await this.repository.findRoleByName(
                RoleName.CITIZEN,
            );

        if (!role) {
            throw new BadRequestException(
                'Citizen role not found',
            );
        }

        const passwordHash =
            await this.hashService.hash(dto.password);

        const user =
            await this.repository.createUser({
                firstName: dto.firstName,
                lastName: dto.lastName,
                email: dto.email,
                phone: dto.phone,
                password: passwordHash,

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



        const accessToken = await this.generateAccessToken({
            sub: user.id,
            role: user.role.name,
            organizationId: user.organizationId,
        });

        const refreshToken = await this.generateRefreshToken();

        await this.saveRefreshToken(refreshToken, user.id);

        return AuthMapper.toAuthResponse(
            user,
            accessToken,
            refreshToken,
        );


    }



    private async generateAccessToken(
        payload: JwtPayload,
    ): Promise<string> {
        return this.jwtService.signAsync(payload);
    }

    async login(dto: LoginDto): Promise<AuthResponseDto> {

        const user =
            await this.repository.findUserByEmailWithRelations(
                dto.email,
            );

        if (!user) {
            throw new UnauthorizedException(
                'Invalid credentials',
            );
        }

        const passwordMatches =
            await this.hashService.compare(
                dto.password,
                user.password,
            );

        if (!passwordMatches) {
            throw new UnauthorizedException(
                'Invalid credentials',
            );
        }

        const accessToken = await this.generateAccessToken({
            sub: user.id,
            role: user.role.name,
            organizationId: user.organizationId,
        });

        const refreshToken = await this.generateRefreshToken();

        await this.saveRefreshToken(refreshToken, user.id);

        return AuthMapper.toAuthResponse(
            user,
            accessToken,
            refreshToken,
        );



    }

    private generateRefreshToken(): string {
        return randomBytes(64).toString('hex');
    }

    private async saveRefreshToken(
        token: string,
        userId: string,
    ) {
        const tokenHash = await this.hashService.hash(token);

        await this.repository.createRefreshToken({
            tokenHash,

            expiresAt: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000,
            ),

            user: {
                connect: {
                    id: userId,
                },
            },
        });
    }



 /*    async refresh(dto: RefreshTokenDto): Promise<AuthResponseDto> {

        const tokenHash = await this.hashService.hash(dto.refreshToken);

        const storedToken =
            await this.repository.findRefreshTokenByUserId(
                dto.userId,
            );

        if (!storedToken) {
            throw new UnauthorizedException(
                'Invalid refresh token',
            );
        }

        const valid =
            await this.hashService.compare(
                dto.refreshToken,
                storedToken.tokenHash,
            );

        if (!valid) {
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
            await this.generateRefreshToken();

        await this.saveRefreshToken(
            refreshToken,
            storedToken.user.id,
        );

        return AuthMapper.toAuthResponse(
            storedToken.user,
            accessToken,
            refreshToken,
        );
    } */



    async logout(userId: string) {

        await this.repository.logout(userId);

    }
}