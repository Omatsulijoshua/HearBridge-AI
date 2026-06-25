import { Module } from '@nestjs/common';
import { WhitelabelService } from './whitelabel.service';
import { WhitelabelController } from './whitelabel.controller';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [WhitelabelController],
  providers: [WhitelabelService, PrismaService],
  exports: [WhitelabelService],
})
export class WhitelabelModule {}
