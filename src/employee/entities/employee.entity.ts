import { Type } from 'class-transformer';
import { ROLE } from '../dto/employee.dto';

export class Employee {
    name: string;
    phone: string;
    email: string;
    designation: string;
    dateOfBirth: string;
    dateOfJoin: string;
    employeeId: string;
    projectIds: string[];
    gender: string
    role: ROLE;
}


export class EmployeeResponseDto {
    message: string;
    @Type(() => Employee)
    data?: Employee | Employee[];
    meta?: any;
    constructor(partial: Partial<EmployeeResponseDto>) {
        Object.assign(this, partial);
    }
}