import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './employee/employee.module';
import { ProjectModule } from './project/project.module';
import { PrismaModule } from './common/modules/prisma.module';
import { OptionsModule } from './options/options.module';

@Module({
  imports: [PrismaModule, EmployeeModule, ProjectModule, OptionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
