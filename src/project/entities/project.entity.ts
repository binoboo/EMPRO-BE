import { Type } from 'class-transformer';

export class Project {
    name: string;
    description: string;
    employeeIds: string;
    projectStatus: string;
    lead?: string;
    manager?: string;
    tools: string[];
    guide: string;
    startDate: string;
    endDate: string;

}


export class ProjectResponseDto {
    message: string;
    @Type(() => Project)
    data?: Project | Project[];
    meta?: any;
    constructor(partial: Partial<ProjectResponseDto>) {
        Object.assign(this, partial);
    }
}