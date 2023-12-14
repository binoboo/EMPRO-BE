import { TABLES } from '@/common';
import { PrismaService } from '@/common/service/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OptionsService {
  constructor(private readonly prismaService: PrismaService) {}

  findDesignations() {
    return this.prismaService.findMany(TABLES.DESIGNATION, {});
  }

}
