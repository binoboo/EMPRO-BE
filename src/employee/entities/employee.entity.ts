import { Type } from 'class-transformer';

export class Employee {
    name: string;
    description: string;
    employeeIds: string;
    projectStatus: string;
    tools: string[];
    guide: string;
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