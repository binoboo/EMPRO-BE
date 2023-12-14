import { ApiProperty, PartialType } from '@nestjs/swagger'
import {
    IsString,
    IsArray,
    IsNotEmpty,
    IsEmail,
    IsOptional,
    IsInt,
} from 'class-validator'


class LeaveInfo {
    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    totalSickLeave: number;
    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    balanceSickLeave: number;
    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    totalCasualLeave: number;
    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    balanceCasualLeave: number;
    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    extraLeave: number;
}

export class CreateEmployeeDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    designation: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    dateOfBirth: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    dateOfJoin: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    employeeId: string;


    // @ApiProperty()
    // @IsNotEmpty()
    // leaveInfo: LeaveInfo;

    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
    @IsOptional()
    projectIds: string[];

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    gender: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    role: ROLE;
}

export enum ROLE {
    ADMIN = "ADMIN",
    INTERN = "INTERN",
    EMPLOYEE = "EMPLOYEE",
    LEAD = "LEAD",
    MANAGER = "MANAGER",
}

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) { }

