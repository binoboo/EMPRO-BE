import { Module, Global } from '@nestjs/common';
import { PrismaService } from '@/common/service/prisma.service';
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
