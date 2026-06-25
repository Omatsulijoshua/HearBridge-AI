import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class WhitelabelService {
  constructor(private prisma: PrismaService) {}

  async getConfigBySubdomain(subdomain: string) {
    const org = await this.prisma.organization.findFirst({
      where: {
        OR: [
          { subdomain: subdomain },
          { customDomain: subdomain },
        ],
      },
      include: { whiteLabelConfig: true },
    });

    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    return org.whiteLabelConfig || {
      appName: 'HearBridge AI',
      primaryColor: '#8B5CF6',
      secondaryColor: '#EC4899',
      logoUrl: null,
    };
  }

  async updateConfig(orgId: string, dto: any) {
    const existing = await this.prisma.whiteLabelConfig.findUnique({
      where: { organizationId: orgId },
    });

    if (existing) {
      return this.prisma.whiteLabelConfig.update({
        where: { organizationId: orgId },
        data: {
          appName: dto.appName,
          logoUrl: dto.logoUrl,
          primaryColor: dto.primaryColor,
          secondaryColor: dto.secondaryColor,
          smtpHost: dto.smtpHost,
          smtpPort: dto.smtpPort ? parseInt(dto.smtpPort) : undefined,
          smtpUser: dto.smtpUser,
          smtpPassword: dto.smtpPassword,
          smtpFromEmail: dto.smtpFromEmail,
          emailTemplates: dto.emailTemplates ? JSON.stringify(dto.emailTemplates) : undefined,
        },
      });
    } else {
      return this.prisma.whiteLabelConfig.create({
        data: {
          organizationId: orgId,
          appName: dto.appName || 'HearBridge AI',
          logoUrl: dto.logoUrl,
          primaryColor: dto.primaryColor || '#8B5CF6',
          secondaryColor: dto.secondaryColor || '#EC4899',
          smtpHost: dto.smtpHost,
          smtpPort: dto.smtpPort ? parseInt(dto.smtpPort) : undefined,
          smtpUser: dto.smtpUser,
          smtpPassword: dto.smtpPassword,
          smtpFromEmail: dto.smtpFromEmail,
          emailTemplates: dto.emailTemplates ? JSON.stringify(dto.emailTemplates) : '{}',
        },
      });
    }
  }
}
