import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { WhitelabelModule } from './modules/whitelabel/whitelabel.module';
import { SystemModule } from './modules/system/system.module';

@Module({
  imports: [AuthModule, WhitelabelModule, SystemModule],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
