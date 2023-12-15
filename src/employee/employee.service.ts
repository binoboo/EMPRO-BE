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
    let projectKey: string= filter?.status ? ["ASSIGNED", "NONASSIGNED"].includes(filter.status) ?  filter.status : "SHADOW" : "";
    
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
    if(filter) {
      where = {
        ...where,
        ...(filter?.role && {role: filter?.role}),
        ...(projectKey && {status: projectKey})
      }
    }
    const employees = await this.prismaService.findMany(TABLES.EMPLOYEE, {
      where,
      include,
      ...(page && limit && { skip: (page - 1) * limit, take: limit })
    })
    
    const totalEmployees = await this.prismaService.findMany(TABLES.EMPLOYEE, {
      where,
     include
    })
    return new EmployeeResponseDto({
      message: "Employees retrieved successfully",
      data: employees,
      meta: {
        current_page: page,
        item_count: limit,
        total_items: totalEmployees.length,
        totalPage: Math.ceil(totalEmployees.length / limit),
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
    const projectData = data?.projectIds
    delete data['projectIds']
    
    const employee = await this.prismaService.create(TABLES.EMPLOYEE, {
      ...data,
      leaveInfo: {
        totalSickLeave: 20,
        balanceSickLeave: 20,
        totalCasualLeave: 20,
        balanceCasualLeave: 20,
        extraLeave: 20,
      },
      ...(data.designation && {
        designation: {
          connect: {
            id: data.designation
          },
        }
      }),
    })

    if (projectData && projectData.length) {
      for (let i = 0; i < projectData?.length; i++) {
        const projectId = projectData[i];
        this.prismaService.create(TABLES.EMPLOYEEPROJECT, {
          employeeId: employee.id,
          projectId: projectId,
        })
      }
    }
    await this.refreshEmployeeStatus();
    return new EmployeeResponseDto({
      message: "Employee created successfully",
      data: employee
    })
  }

  async updateEmployee(id: string, data: UpdateEmployeeDto): Promise<EmployeeResponseDto> {
    await this.checkEmployee(id)
    const projectData = data?.projectIds
    delete data['projectIds']
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

    if (projectData && projectData.length) {
      for (let i = 0; i < projectData?.length; i++) {
        const projectId = projectData[i];
        this.prismaService.create(TABLES.EMPLOYEEPROJECT, {
          employeeId: id,
          projectId: projectId,
        })
      }
    }
    await this.refreshEmployeeStatus();
    return new EmployeeResponseDto({
      message: "Employee updated successfully",
      data: updatedEmployee
    })
  }

  async deleteEmployee(id: string) {
    await this.checkEmployee(id)
    const checkEmployees = await this.prismaService.findMany(TABLES.EMPLOYEEPROJECT, {
      where: {
        employeeId: id,
        shadowId: id
      }
    })
    const employeeIds = checkEmployees.map(project => project.id)
    await this.prismaService.deleteMany(TABLES.EMPLOYEEPROJECT, {
      where: {
        id: {
          in: employeeIds
        }
      }
    })
    return {
      message: "Employee deleted successfully",
    }
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

 
  async refreshEmployeeStatus() {

    const directProjectEmployees = await this.prismaService.findMany(TABLES.EMPLOYEEPROJECT, {
      distinct:["employeeId"],
      select: {
        employeeId: true
      }
    })
    const shadowProjectEmployees = await this.prismaService.findMany(TABLES.EMPLOYEEPROJECT, {
      distinct:["shadowId"],
      select: {
        shadowId: true
      }
    })
    const directProjectEmployeeIds = directProjectEmployees.filter((employee: any) => Boolean(employee.employeeId)).map((employee: any) => employee.employeeId)
    const shadowProjectEmployeesIds = shadowProjectEmployees.filter((employee: any) => Boolean(employee.shadowId)).map((employee: any) => employee.shadowId)
    
    await this.prismaService.updateMany(TABLES.EMPLOYEE, {
      where: {
        id: {
          in: directProjectEmployeeIds
        }
      },
      data: {
        status: "ASSIGNED"
      }
    })

    await this.prismaService.updateMany(TABLES.EMPLOYEE, {
      where: {
        id: {
          in: shadowProjectEmployeesIds
        }
      },
      data: {
        status: "SHADOW"
      }
    })

    await this.prismaService.updateMany(TABLES.EMPLOYEE, {
      where: {
        id: {
          not: {
            in: [...directProjectEmployeeIds, ...shadowProjectEmployeesIds]
          }
        }
      },
      data: {
        status: "NONASSIGNED"
      }
    })
  }

}
