import { Controller, Get, Query } from '@nestjs/common';
import { OptionsService } from './options.service';
import { ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags("Drowdown")
@Controller('options')
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) {}


  @Get("/designations")
  findDesignations() {
    return this.optionsService.findDesignations();
  }

  @Get("/skills")
  @ApiQuery({
    name: 'search',
    required: false,
})
  findSkills(
    @Query('search') search: string,
  ) {
    return this.optionsService.findSkills(search);
  }
  
  @Get("/roles")
  findRoles() {
    return this.optionsService.findRoles();
  }

  @Get("/dashboard")
  dashBoard() {
    return this.optionsService.dashBoard();
  }

  @Get("/dashboard/chart")
  employeePercentage() {
    return this.optionsService.employeePercentage();
  }
  
}
