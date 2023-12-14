import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '@/common/service/prisma.service';
import { PROJECT_NOT_EXISTS } from '@/common';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { ProjectResponseDto } from './entities/project.entity';
import { TABLES } from '@/common';

@Injectable()
export class ProjectService {

  constructor(private readonly prismaService: PrismaService) { }

  async getProjects(page: number, limit: number, search: string, projectIds: string[], filter: object): Promise<ProjectResponseDto> {
    let where: any = {}
    const include = {
      lead: true,
      employee: {
        include: {
          employee: {
            include: {
              designation: true
            }
          },
          shadow: {
            include: {
              designation: true
            }
          },
        }
      },
      manager: true
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
    if (projectIds?.length) {
      where = {
        ...where,
        id: {
          in: projectIds
        }
      }
    }
    if (filter) {
      where = {
        ...where,
        ...filter
      }
    }
    const projects = await this.prismaService.findMany(TABLES.PROJECT, {
      where,
      include,
      ...(page && limit && { skip: (page - 1) * limit, take: limit })
    })

    const projectsWithoutPagination = await this.prismaService.findMany(TABLES.PROJECT, {
      where,
      include
    })
    return new ProjectResponseDto({
      message: "Projects retrieved successfully",
      data: projects,
      meta: {
        current_page: page,
        item_count: limit,
        total_items: projectsWithoutPagination.length,
        totalPage: Math.ceil(projectsWithoutPagination.length / limit),
      },
    })
  }

  async getProject(id: string): Promise<ProjectResponseDto> {
    const project = await this.checkProject(id)
    return new ProjectResponseDto({
      message: "Project retrieved successfully",
      data: project
    })
  }

  async createProject(data: CreateProjectDto): Promise<ProjectResponseDto> {
    const employeeData = data?.employeeIds
    delete data['employeeIds']
    const project = await this.prismaService.create(TABLES.PROJECT, {
      ...data,
      ...(data.lead && {
        lead: {
          connect: {
            id: data.lead
          },
        }
      }),
      ...(data.manager && {
        manager: {
          connect: {
            id: data.manager
          },
        }
      }),
    })

    if (employeeData && employeeData.length) {
      for (let i = 0; i < employeeData.length; i++) {
        const employee = employeeData[i];
        for (let j = 0; j < employee?.shadow?.length; j++) {
          const shadow = employee?.shadow[j];
          this.prismaService.create(TABLES.EMPLOYEEPROJECT, {
            employeeId: employee.direct,
            projectId: project.id,
            shadowId: shadow
          })
        }
      }
    }
    this.refreshEmployeeStatus();

    return new ProjectResponseDto({
      message: "Project created successfully",
      data: project
    })
  }

  async updateProject(id: string, data: UpdateProjectDto): Promise<ProjectResponseDto> {
    await this.checkProject(id)
    const employeeData = data?.employeeIds
    delete data['employeeIds']
    const updatedProject = await this.prismaService.update(TABLES.PROJECT, {
      where: {
        id,
      },
      data: {
        ...data,
        ...(data.lead && {
          lead: {
            connect: {
              id: data.lead
            },
          }
        }),
        ...(data.manager && {
          manager: {
            connect: {
              id: data.manager
            },
          }
        }),
      },
      include: {
        lead: true,
        employee: {
          include: {
            employee: {
              include: {
                designation: true
              }
            },
            shadow: {
              include: {
                designation: true
              }
            },
          }
        },
        manager: true
      }
    })

    // Delete Existing Mapping
    await this.prismaService.delete(TABLES.EMPLOYEEPROJECT, {
      where: {
        projectId: id,
      }
    })

    // Create New  Mapping
    if (employeeData && employeeData.length) {
      for (let i = 0; i < employeeData.length; i++) {
        const employee = employeeData[i];
        for (let j = 0; j < employee?.shadow?.length; j++) {
          const shadow = employee?.shadow[j];
          this.prismaService.create(TABLES.EMPLOYEEPROJECT, {
            employeeId: employee.direct,
            projectId: id,
            shadowId: shadow
          })
        }
      }
    }
    this.refreshEmployeeStatus();

    return new ProjectResponseDto({
      message: "Project updated successfully",
      data: updatedProject
    })
  }

  async deleteProject(id: string): Promise<ProjectResponseDto> {
    const project = await this.checkProject(id)
    await this.prismaService.delete(TABLES.PROJECT, {
      where: {
        id,
      }
    })
    return new ProjectResponseDto({
      message: "Project deleted successfully",
      data: project
    })
  }

  async checkProject(id: string) {
    const project = await this.prismaService.findUnique(TABLES.PROJECT, {
      where: {
        id,
      },
      include: {
        lead: true,
        employee: {
          include: {
            employee: {
              include: {
                designation: true
              }
            },
            shadow: {
              include: {
                designation: true
              }
            },
          }
        },
        manager: true
      }
    })
    if (project) {
      return project
    }
    throw new NotFoundException(PROJECT_NOT_EXISTS)
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
    const directProjectEmployeeIds = directProjectEmployees.map((employee: any) => employee.employeeId)
    const shadowProjectEmployeesIds = shadowProjectEmployees.map((employee: any) => employee.shadowId)
    
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
