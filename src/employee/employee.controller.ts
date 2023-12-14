import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    HttpStatus,
    ParseIntPipe,
    Query,
    Req
} from '@nestjs/common';
import {
    ApiQuery,
    ApiResponse,
    ApiTags
} from '@nestjs/swagger';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';
import { EmployeeResponseDto } from './entities/employee.entity';
import { Sort } from '@/common';


@ApiTags("Employee")
@Controller('employee')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) { }

    @Get('/')
    @ApiQuery({
        name: 'search',
        required: false,
    })
    @ApiQuery({
        name: 'limit',
        required: false,
    })
    @ApiQuery({
        name: 'page',
        required: false,
    })
    @ApiQuery({
        name: 'ids',
        required: false,
    })
    @ApiQuery({
        name: 'filter',
        required: false,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Employees Successfully Fetched',
    })
    async getEmployees(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('search') search: string,
        @Query('ids') ids: string,
        @Query('filter') filter: string,
        ): Promise<EmployeeResponseDto> {
        return this.employeeService.getEmployees(
            page,
            limit,
            search,
            ids ? JSON.parse(ids) : [],
            filter ? JSON.parse(filter) : null
        )
    }

    @Get('/:id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Employee Successfully Fetched',
    })
    async getEmployee(
        @Param('id') id: string
    ): Promise<EmployeeResponseDto> {
        return this.employeeService.getEmployee(id)
    }

    @Post('/')
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Employees Successfully Created',
    })
    async createEmployee(
        @Body() data: CreateEmployeeDto
    ): Promise<EmployeeResponseDto> {
        return this.employeeService.createEmployee(data)
    }

    @Put('/:id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Employees Successfully Updated',
    })
    async updateEmployee(
        @Param('id') id: string,
        @Body() data: UpdateEmployeeDto
    ): Promise<EmployeeResponseDto> {
        return this.employeeService.updateEmployee(id, data)
    }

    @Delete('/:id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Employees Successfully Deleted',
    })
    async deleteEmployee(
        @Param('id') id: string
    ): Promise<EmployeeResponseDto> {
        return this.employeeService.deleteEmployee(id)
    }
}
