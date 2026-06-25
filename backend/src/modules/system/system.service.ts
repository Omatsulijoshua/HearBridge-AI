import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SystemService {
  constructor(private prisma: PrismaService) {}

  // 1-Click Backup: Query all data tables and compile into a single structured object
  async generateBackup() {
    try {
      const organizations = await this.prisma.organization.findMany();
      const users = await this.prisma.user.findMany();
      const whiteLabelConfigs = await this.prisma.whiteLabelConfig.findMany();
      const subscriptions = await this.prisma.subscription.findMany();
      const soundLibrary = await this.prisma.soundLibrary.findMany();
      const systemSettings = await this.prisma.systemSettings.findMany();
      const translations = await this.prisma.translation.findMany();

      const backupData = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        tables: {
          organizations,
          users,
          whiteLabelConfigs,
          subscriptions,
          soundLibrary,
          systemSettings,
          translations,
        },
      };

      const backupJson = JSON.stringify(backupData, null, 2);
      const filename = `hearbridge_backup_${Date.now()}.json`;
      const sizeBytes = Buffer.byteLength(backupJson, 'utf8');

      // Log the backup action in database
      await this.prisma.systemBackupLog.create({
        data: {
          filename,
          sizeBytes,
          status: 'COMPLETED',
        },
      });

      return {
        filename,
        sizeBytes,
        createdAt: backupData.timestamp,
        data: backupData, // In production, this can be written to S3 or downloaded as a file attachment
      };
    } catch (error) {
      await this.prisma.systemBackupLog.create({
        data: {
          filename: `failed_backup_${Date.now()}.json`,
          sizeBytes: 0,
          status: 'FAILED',
          errorLog: error.message || 'Unknown error during backup',
        },
      });
      throw new InternalServerErrorException('Failed to generate backup: ' + error.message);
    }
  }

  // 1-Click Restore: Truncate existing tables and inject backup structures
  async restoreBackup(backupData: any) {
    if (!backupData || !backupData.tables) {
      throw new BadRequestException('Invalid backup file structure');
    }

    const { tables } = backupData;

    try {
      await this.prisma.$transaction(async (tx) => {
        // Clear tables in reverse dependency order
        await tx.translation.deleteMany();
        await tx.whiteLabelConfig.deleteMany();
        await tx.subscription.deleteMany();
        await tx.soundProgress.deleteMany();
        await tx.speechLog.deleteMany();
        await tx.listeningProgress.deleteMany();
        await tx.realWorldDetection.deleteMany();
        await tx.milestone.deleteMany();
        await tx.session.deleteMany();
        await tx.patient.deleteMany();
        await tx.therapist.deleteMany();
        await tx.refreshToken.deleteMany();
        await tx.user.deleteMany();
        await tx.organization.deleteMany();
        await tx.soundLibrary.deleteMany();
        await tx.systemSettings.deleteMany();

        // Restore core settings
        if (tables.systemSettings && tables.systemSettings.length > 0) {
          await tx.systemSettings.createMany({ data: tables.systemSettings });
        } else {
          // Default config
          await tx.systemSettings.create({
            data: { id: 'global_config', ownerEmail: 'admin@hearbridge.ai', licenseKey: 'HB-DEV' },
          });
        }

        // Restore organizations
        if (tables.organizations?.length > 0) {
          await tx.organization.createMany({ data: tables.organizations });
        }

        // Restore users
        if (tables.users?.length > 0) {
          await tx.user.createMany({ data: tables.users });
        }

        // Restore whitelabel configs
        if (tables.whiteLabelConfigs?.length > 0) {
          await tx.whiteLabelConfig.createMany({ data: tables.whiteLabelConfigs });
        }

        // Restore subscriptions
        if (tables.subscriptions?.length > 0) {
          await tx.subscription.createMany({ data: tables.subscriptions });
        }

        // Restore sound library
        if (tables.soundLibrary?.length > 0) {
          await tx.soundLibrary.createMany({ data: tables.soundLibrary });
        }

        // Restore translations
        if (tables.translations?.length > 0) {
          await tx.translation.createMany({ data: tables.translations });
        }
      });

      return { status: 'SUCCESS', message: 'System state restored successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Restore transaction failed: ' + error.message);
    }
  }

  // Transfer Ownership Panel logic
  async transferOwnership(dto: any) {
    const {
      buyerEmail,
      buyerPassword,
      stripeSecretKey,
      paystackSecret,
      flutterwaveSecret,
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPassword,
      smtpFromEmail,
    } = dto;

    try {
      return await this.prisma.$transaction(async (tx) => {
        // Update global settings
        const currentSettings = await tx.systemSettings.findUnique({
          where: { id: 'global_config' },
        });

        const newHash = await bcrypt.hash(buyerPassword, 10);

        if (currentSettings) {
          await tx.systemSettings.update({
            where: { id: 'global_config' },
            data: {
              ownerEmail: buyerEmail,
              globalStripeSecretKey: stripeSecretKey || currentSettings.globalStripeSecretKey,
              globalPaystackSecret: paystackSecret || currentSettings.globalPaystackSecret,
              globalFlutterwaveSecret: flutterwaveSecret || currentSettings.globalFlutterwaveSecret,
            },
          });
        }

        // Update or create Super Admin User Account
        const superAdmins = await tx.user.findMany({
          where: { role: 'SUPER_ADMIN' },
        });

        if (superAdmins.length > 0) {
          // Update the first super admin
          await tx.user.update({
            where: { id: superAdmins[0].id },
            data: {
              email: buyerEmail,
              name: 'Super Admin',
              passwordHash: newHash,
              isActive: true,
            },
          });
        } else {
          // Create a new one
          await tx.user.create({
            data: {
              email: buyerEmail,
              name: 'Super Admin',
              passwordHash: newHash,
              role: 'SUPER_ADMIN',
            },
          });
        }

        // If SMTP credentials provided, update the global/primary Organization white-label settings as fallback
        const primaryOrg = await tx.organization.findFirst({
          orderBy: { createdAt: 'asc' },
        });

        if (primaryOrg && smtpHost) {
          await tx.whiteLabelConfig.upsert({
            where: { organizationId: primaryOrg.id },
            update: {
              smtpHost,
              smtpPort: smtpPort ? parseInt(smtpPort) : undefined,
              smtpUser,
              smtpPassword,
              smtpFromEmail,
            },
            create: {
              organizationId: primaryOrg.id,
              smtpHost,
              smtpPort: smtpPort ? parseInt(smtpPort) : undefined,
              smtpUser,
              smtpPassword,
              smtpFromEmail,
            },
          });
        }

        return {
          status: 'SUCCESS',
          message: 'Ownership transfer complete. Administrator credentials and payment bindings rotated successfully.',
          newAdminEmail: buyerEmail,
        };
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to transfer ownership: ' + error.message);
    }
  }

  // License checking API
  async checkLicense(key: string) {
    const settings = await this.prisma.systemSettings.findUnique({
      where: { id: 'global_config' },
    });

    if (!settings) {
      return { licenseKey: key, status: 'INVALID', reason: 'No configuration found' };
    }

    if (settings.licenseKey === key) {
      return { licenseKey: key, status: 'VALID', owner: settings.ownerEmail };
    }

    return { licenseKey: key, status: 'INVALID', reason: 'Mismatch' };
  }

  async updateLicense(key: string) {
    const updated = await this.prisma.systemSettings.update({
      where: { id: 'global_config' },
      data: {
        licenseKey: key,
        licenseStatus: 'VALID',
      },
    });

    return { licenseKey: updated.licenseKey, status: updated.licenseStatus };
  }
}
