import { Controller, Get } from '@nestjs/common';
import { OptionsService } from './options.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Drowdown")
@Controller('options')
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) {}


  @Get("/designations")
  findDesignations() {
    return this.optionsService.findDesignations();
  }
  
}
