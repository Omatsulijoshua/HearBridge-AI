import { Controller, Get, Post, Body, Param, Put, UseGuards, Request } from '@nestjs/common';
import { WhitelabelService } from './whitelabel.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('whitelabel')
export class WhitelabelController {
  constructor(private readonly whitelabelService: WhitelabelService) {}

  @Get('subdomain/:subdomain')
  async getConfigBySubdomain(@Param('subdomain') subdomain: string) {
    return this.whitelabelService.getConfigBySubdomain(subdomain);
  }

  @UseGuards(JwtAuthGuard)
  @Put('config')
  async updateConfig(@Request() req: any, @Body() dto: any) {
    // Standard role checks can be added here (e.g. ORG_ADMIN or SUPER_ADMIN)
    const orgId = req.user.organizationId || dto.organizationId;
    return this.whitelabelService.updateConfig(orgId, dto);
  }
}
