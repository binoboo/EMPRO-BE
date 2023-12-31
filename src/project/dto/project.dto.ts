import { ApiProperty, PartialType } from '@nestjs/swagger'
import {
    IsString,
    IsArray,
    IsNotEmpty,
    IsOptional,
} from 'class-validator'

class EmployeeShadow {
    direct: string;
    shadow: string[];
}

export class CreateProjectDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    employeeIds?: any;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lead?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    manager?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    projectStatus: string;

    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
    tools: string[];
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    guide: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    startDate: string;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    endDate: string;
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
