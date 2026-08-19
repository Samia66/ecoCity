import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthRepository, UserWithRoleAndOrg } from './auth.repository';
import { AuthMapper } from './auth.mapper';
import * as hashUtil from '../../common/utils/hash.util';
import { RoleName } from '../../common/constants/roles.constant';

function buildUser(overrides: Partial<UserWithRoleAndOrg> = {}): UserWithRoleAndOrg {
  return {
    id: 'user-1',
    organizationId: 'org-1',
    roleId: 'role-1',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    phone: null,
    password: 'hashed-password',
    mustChangePassword: false,
    avatarUrl: null,
    status: 'ACTIVE',
    isEmailVerified: true,
    emailVerifiedAt: null,
    lastLoginAt: null,
    failedLoginAttempts: 0,
    lockedUntil: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    role: { id: 'role-1', name: RoleName.CITIZEN, description: null, isSystem: true, createdAt: new Date(), updatedAt: new Date(), permissions: [] },
    organization: { id: 'org-1', name: 'Cotonou', city: 'Cotonou', address: null, phone: null, email: null, logoUrl: null, active: true, createdAt: new Date(), updatedAt: new Date(), deletedAt: null },
    ...overrides,
  } as UserWithRoleAndOrg;
}

describe('AuthService', () => {
  let service: AuthService;
  let repository: jest.Mocked<AuthRepository>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    repository = {
      findUserByEmail: jest.fn(),
      findUserById: jest.fn(),
      findDefaultRoleByName: jest.fn(),
      findDefaultOrganization: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
      recordSuccessfulLogin: jest.fn(),
      incrementFailedAttempts: jest.fn(),
      createRefreshToken: jest.fn(),
      findRefreshTokenByHash: jest.fn(),
      revokeRefreshToken: jest.fn(),
      revokeAllUserRefreshTokens: jest.fn(),
      createPasswordResetToken: jest.fn(),
      findPasswordResetTokenByHash: jest.fn(),
      markPasswordResetTokenUsed: jest.fn(),
      createEmailVerificationToken: jest.fn(),
      findEmailVerificationTokenByHash: jest.fn(),
      markEmailVerificationTokenUsed: jest.fn(),
    } as unknown as jest.Mocked<AuthRepository>;

    jwtService = { signAsync: jest.fn().mockResolvedValue('signed-jwt') } as unknown as jest.Mocked<JwtService>;

    const configService = {
      get: jest.fn().mockReturnValue({
        bcryptSaltRounds: 4,
        jwt: {
          accessSecret: 'secret',
          accessExpiresIn: '15m',
          refreshSecret: 'refresh-secret',
          refreshExpiresIn: '7d',
        },
      }),
    } as unknown as ConfigService;

    service = new AuthService(repository, new AuthMapper(), jwtService, configService);
    repository.createRefreshToken.mockResolvedValue({} as any);
  });

  afterEach(() => jest.restoreAllMocks());

  describe('login', () => {
    it('throws UnauthorizedException when no user matches the email', async () => {
      repository.findUserByEmail.mockResolvedValue(null);
      await expect(service.login({ email: 'nobody@example.com', password: 'x' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException when the account is locked', async () => {
      const lockedUntil = new Date(Date.now() + 10 * 60_000);
      repository.findUserByEmail.mockResolvedValue(buildUser({ lockedUntil }));
      await expect(service.login({ email: 'ada@example.com', password: 'x' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException when the account is not ACTIVE', async () => {
      repository.findUserByEmail.mockResolvedValue(buildUser({ status: 'SUSPENDED' }));
      await expect(service.login({ email: 'ada@example.com', password: 'x' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('records a failed attempt and throws when the password does not match', async () => {
      const user = buildUser({ failedLoginAttempts: 2 });
      repository.findUserByEmail.mockResolvedValue(user);
      jest.spyOn(hashUtil, 'comparePassword').mockResolvedValue(false);

      await expect(service.login({ email: 'ada@example.com', password: 'wrong' })).rejects.toThrow(
        UnauthorizedException,
      );
      expect(repository.incrementFailedAttempts).toHaveBeenCalledWith('user-1', 3, null);
    });

    it('locks the account once failed attempts reach the threshold (5)', async () => {
      const user = buildUser({ failedLoginAttempts: 4 });
      repository.findUserByEmail.mockResolvedValue(user);
      jest.spyOn(hashUtil, 'comparePassword').mockResolvedValue(false);

      await expect(service.login({ email: 'ada@example.com', password: 'wrong' })).rejects.toThrow(
        UnauthorizedException,
      );
      const [, attempts, lockedUntil] = repository.incrementFailedAttempts.mock.calls[0];
      expect(attempts).toBe(5);
      expect(lockedUntil).toBeInstanceOf(Date);
    });

    it('returns tokens and the mapped user on success', async () => {
      const user = buildUser();
      repository.findUserByEmail.mockResolvedValue(user);
      jest.spyOn(hashUtil, 'comparePassword').mockResolvedValue(true);
      repository.recordSuccessfulLogin.mockResolvedValue(user as any);

      const result = await service.login({ email: 'ada@example.com', password: 'correct' });

      expect(result.accessToken).toBe('signed-jwt');
      expect(result.refreshToken).toHaveLength(96);
      expect(result.user.email).toBe('ada@example.com');
      expect(repository.recordSuccessfulLogin).toHaveBeenCalledWith('user-1');
    });
  });

  describe('register', () => {
    it('throws ConflictException when the email is already taken', async () => {
      repository.findUserByEmail.mockResolvedValue(buildUser());
      await expect(
        service.register({ firstName: 'A', lastName: 'B', email: 'ada@example.com', password: 'x' } as any),
      ).rejects.toThrow(ConflictException);
    });

    it('throws NotFoundException when the CITIZEN role is not seeded', async () => {
      repository.findUserByEmail.mockResolvedValue(null);
      repository.findDefaultRoleByName.mockResolvedValue(null);
      await expect(
        service.register({ firstName: 'A', lastName: 'B', email: 'new@example.com', password: 'x' } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when no organization is configured and none is provided', async () => {
      repository.findUserByEmail.mockResolvedValue(null);
      repository.findDefaultRoleByName.mockResolvedValue({ id: 'role-citizen' } as any);
      repository.findDefaultOrganization.mockResolvedValue(null);
      await expect(
        service.register({ firstName: 'A', lastName: 'B', email: 'new@example.com', password: 'x' } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('creates the user under the default organization and returns tokens', async () => {
      repository.findUserByEmail.mockResolvedValue(null);
      repository.findDefaultRoleByName.mockResolvedValue({ id: 'role-citizen' } as any);
      repository.findDefaultOrganization.mockResolvedValue({ id: 'org-default' } as any);
      const createdUser = buildUser({ id: 'user-2', email: 'new@example.com' });
      repository.createUser.mockResolvedValue(createdUser);

      const result = await service.register({
        firstName: 'A',
        lastName: 'B',
        email: 'new@example.com',
        password: 'x',
      } as any);

      expect(result.user.email).toBe('new@example.com');
      expect(repository.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          organization: { connect: { id: 'org-default' } },
          role: { connect: { id: 'role-citizen' } },
        }),
      );
    });
  });

  describe('refresh', () => {
    it('throws UnauthorizedException when the refresh token is unknown', async () => {
      repository.findRefreshTokenByHash.mockResolvedValue(null);
      await expect(service.refresh('raw-token')).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when the refresh token has expired', async () => {
      repository.findRefreshTokenByHash.mockResolvedValue({
        id: 'rt-1',
        expiresAt: new Date(Date.now() - 1000),
        user: buildUser(),
      } as any);
      await expect(service.refresh('raw-token')).rejects.toThrow(UnauthorizedException);
    });

    it('rotates the refresh token and returns fresh tokens', async () => {
      const user = buildUser();
      repository.findRefreshTokenByHash.mockResolvedValue({
        id: 'rt-1',
        expiresAt: new Date(Date.now() + 60_000),
        user,
      } as any);

      const result = await service.refresh('raw-token');

      expect(result.accessToken).toBe('signed-jwt');
      expect(repository.revokeRefreshToken).toHaveBeenCalledWith('rt-1', expect.any(String));
    });
  });
});
