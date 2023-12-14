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
    employeeIds?: EmployeeShadow[];

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
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
