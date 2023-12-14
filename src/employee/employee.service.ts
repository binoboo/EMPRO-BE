import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '@/common/service/prisma.service';
import { EMPLOYEE_NOT_EXISTS } from '@/common';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';
import { EmployeeResponseDto } from './entities/employee.entity';
import { TABLES } from '@/common';

@Injectable()
export class EmployeeService {

  constructor(private readonly prismaService: PrismaService) { }

  async getEmployees(page: number, limit: number, search: string, employeeIds: string[], filter: any): Promise<EmployeeResponseDto> {
    let where: any = {}
    let projectKey: string= filter?.projectStatus === "ASSIGNED" ? "directProject" : filter?.projectStatus === "SHADOW" ? "shadowProject" : "";
    const include = {
      directProject: {
        include: {
          project: {
            include: {
              lead: true,
              manager: true
            }
          },
        }
      },
      shadowProject: {
        include: {
          project: {
            include: {
              lead: true,
              manager: true
            }
          },
        }
      },
      designation: true,
      leadOf: true
    }
    if (search?.trim()) {
      where = {
        ...where,
        name: {
          contains: search,
          mode: "insensitive",
        },
      }
    }
    if (employeeIds?.length) {
      where = {
        ...where,
        id: {
          in: employeeIds
        }
      }
    }
    const employees = await this.prismaService.findMany(TABLES.EMPLOYEE, {
      where,
      include,
      ...(page && limit && { skip: (page - 1) * limit, take: limit })
    })
    
    const employeesWithoutPagination = await this.prismaService.findMany(TABLES.EMPLOYEE, {
      where,
     include
    })
    const employeesCount = employeesWithoutPagination?.filter((employee: any) => projectKey ? employee[projectKey].length : !employee['directProject'].length && !employee['shadowProject'].length)?.length || 0
    return new EmployeeResponseDto({
      message: "Employees retrieved successfully",
      data: employees?.filter((employee: any) => projectKey ? employee[projectKey].length : !employee['directProject'].length && !employee['shadowProject'].length),
      meta: {
        current_page: page,
        item_count: limit,
        total_items: employeesCount,
        totalPage: Math.ceil(employeesCount / limit),
      },
    })
  }

  async getEmployee(id: string): Promise<EmployeeResponseDto> {
    const employee = await this.checkEmployee(id)
    return new EmployeeResponseDto({
      message: "Employee retrieved successfully",
      data: employee
    })
  }

  async createEmployee(data: CreateEmployeeDto): Promise<EmployeeResponseDto> {
    const employee = await this.prismaService.create(TABLES.EMPLOYEE, {
      ...data,
      ...(data.designation && {
        designation: {
          connect: {
            id: data.designation
          },
        }
      }),
    })

    if (data?.projectIds && data.projectIds.length) {
      for (let i = 0; i < data?.projectIds?.length; i++) {
        const projectId = data.projectIds[i];
        this.prismaService.create(TABLES.EMPLOYEEPROJECT, {
          employeeId: employee.id,
          projectId: projectId,
        })
      }
    }

    return new EmployeeResponseDto({
      message: "Employee created successfully",
      data: employee
    })
  }

  async updateEmployee(id: string, data: UpdateEmployeeDto): Promise<EmployeeResponseDto> {
    await this.checkEmployee(id)
    const updatedEmployee = await this.prismaService.update(TABLES.EMPLOYEE, {
      where: {
        id,
      },
      data: {
        ...data,
        ...(data.designation && {
          designation: {
            connect: {
              id: data.designation
            },
          }
        })
      }
    })

    
    // Delete Existing Mapping
    await this.prismaService.delete(TABLES.EMPLOYEEPROJECT, {
      where: {
        employeeId :id,
      }
    })

    if (data?.projectIds && data.projectIds.length) {
      for (let i = 0; i < data?.projectIds?.length; i++) {
        const projectId = data.projectIds[i];
        this.prismaService.create(TABLES.EMPLOYEEPROJECT, {
          employeeId: id,
          projectId: projectId,
        })
      }
    }

    return new EmployeeResponseDto({
      message: "Employee updated successfully",
      data: updatedEmployee
    })
  }

  async deleteEmployee(id: string): Promise<EmployeeResponseDto> {
    const employee = await this.checkEmployee(id)
    await this.prismaService.delete(TABLES.EMPLOYEE, {
      where: {
        id,
      }
    })
    return new EmployeeResponseDto({
      message: "Employee deleted successfully",
      data: employee
    })
  }

  async checkEmployee(id: string) {
    const employee = await this.prismaService.findUnique(TABLES.EMPLOYEE, {
      where: {
        id,
      },
      include: {
        directProject: {
          include: {
            project: {
              include: {
                lead: true,
                manager: true
              }
            },
          }
        },
        shadowProject: {
          include: {
            project: {
              include: {
                lead: true,
                manager: true
              }
            },
          }
        },
        designation: true,
        leadOf: true
      }
    })
    if (employee) {
      return employee
    }
    throw new NotFoundException(EMPLOYEE_NOT_EXISTS)
  }


}
