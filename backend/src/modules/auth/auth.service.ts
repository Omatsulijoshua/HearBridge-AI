import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: any) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    // Create user and specific profile based on role
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          passwordHash,
          name: dto.name,
          role: dto.role,
          organizationId: dto.organizationId,
        },
      });

      if (dto.role === 'PATIENT') {
        await tx.patient.create({
          data: {
            userId: user.id,
            organizationId: dto.organizationId,
            hearingAidType: dto.hearingAidType || 'NONE',
            rehabAge: dto.rehabAge || 0,
          },
        });
      } else if (dto.role === 'THERAPIST') {
        await tx.therapist.create({
          data: {
            userId: user.id,
            organizationId: dto.organizationId,
            specialty: dto.specialty || 'General Speech Pathology',
          },
        });
      }

      return this.generateTokens(user);
    });
  }

  async login(dto: any) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials or inactive user');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  async googleLogin(dto: any) {
    let user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      // Auto register patient
      user = await this.prisma.$transaction(async (tx) => {
        const u = await tx.user.create({
          data: {
            email: dto.email,
            name: dto.name,
            role: 'PATIENT',
            googleId: dto.googleId,
            organizationId: dto.organizationId,
          },
        });
        await tx.patient.create({
          data: {
            userId: u.id,
            organizationId: dto.organizationId,
            hearingAidType: 'NONE',
            rehabAge: 0,
          },
        });
        return u;
      });
    } else {
      if (!user.googleId) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { googleId: dto.googleId },
        });
      }
    }

    return this.generateTokens(user);
  }

  async generateTokens(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'super_secret_jwt_key_for_hearbridge_ai_2026',
      expiresIn: '1d',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refresh_super_secret_jwt_key_2026',
      expiresIn: '7d',
    });

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organizationId: user.organizationId,
      },
      accessToken,
      refreshToken,
    };
  }
}
