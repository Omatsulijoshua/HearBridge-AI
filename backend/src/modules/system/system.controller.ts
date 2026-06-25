import { Controller, Get, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { SystemService } from './system.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @UseGuards(JwtAuthGuard)
  @Post('backup')
  @HttpCode(HttpStatus.OK)
  async backup() {
    // Note: In production, verify user.role === 'SUPER_ADMIN'
    return this.systemService.generateBackup();
  }

  @UseGuards(JwtAuthGuard)
  @Post('restore')
  @HttpCode(HttpStatus.OK)
  async restore(@Body() body: any) {
    // Note: In production, verify user.role === 'SUPER_ADMIN'
    return this.systemService.restoreBackup(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('transfer-ownership')
  @HttpCode(HttpStatus.OK)
  async transferOwnership(@Body() dto: any) {
    // Note: In production, verify user.role === 'SUPER_ADMIN'
    return this.systemService.transferOwnership(dto);
  }

  @Get('license/:key')
  async checkLicense(@Body() body: any, @Body('key') key: string) {
    return this.systemService.checkLicense(key);
  }

  @UseGuards(JwtAuthGuard)
  @Post('license')
  async updateLicense(@Body('key') key: string) {
    return this.systemService.updateLicense(key);
  }
}
