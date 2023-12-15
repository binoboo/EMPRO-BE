import { ROLE, TABLES } from '@/common';
import { PrismaService } from '@/common/service/prisma.service';
import { Injectable } from '@nestjs/common';
import { EMPLOYEESTATUS } from '@prisma/client';

@Injectable()
export class OptionsService {
  constructor(private readonly prismaService: PrismaService) { }

  findDesignations() {
    return this.prismaService.findMany(TABLES.DESIGNATION, {});
  }

  findSkills(search: string) {
    return this.prismaService.findMany(TABLES.SKILLS, {
      ...(search?.trim() && {
        name: {
          contains: search,
          mode: "insensitive",
        }
      })
    });
  }

  findRoles() {
    return Object.values(ROLE);
  }

  async dashBoard() {
    const designationsWithoutInterns = await this.prismaService.findMany( TABLES.DESIGNATION,{
      where: {
        name: {
          not: "intern",
          mode: "insensitive"
        }
      }
    })
    const designationsWithoutInternIds = designationsWithoutInterns.map(designation => designation?.id)

    const totalEmployes = await this.prismaService.findMany( TABLES.EMPLOYEE,{
      where: {
          designationId: {
              in : designationsWithoutInternIds
          }
      }
    })

    const totalEmployeeIds = totalEmployes.map(emp => emp.id)

    const totalEmployees = await this.prismaService.count( TABLES.EMPLOYEE,{
      where: {
          designationId: {
              in : designationsWithoutInternIds
          }
      }
    })
    const totalInterns = await this.prismaService.count( TABLES.EMPLOYEE,{
      where: {
          designationId: {
              notIn : designationsWithoutInternIds
          }
      }
    })


    const directEmployee = await this.prismaService.findMany( TABLES.EMPLOYEEPROJECT,{
      distinct: "employeeId",
      where: {
        employeeId: {
          in: totalEmployeeIds
        }
      }

    })
    const shadowEmployee = await this.prismaService.findMany( TABLES.EMPLOYEEPROJECT,{
      distinct: "shadowId",
      where : {
        shadowId: {
          not: null
        },
        employeeId: {
          in: totalEmployeeIds
        }
      }
    })


    const totalBench = totalEmployees - (directEmployee.length + shadowEmployee.length)

    const totalProjectOnHold = await this.prismaService.count( TABLES.PROJECT,{
      where: {
          projectStatus: "Idle"
      }
    })
    const totalProject = await this.prismaService.count( TABLES.PROJECT,{})

    return {
      project: {
        totalProject,
        totalProjectOnHold,
        totalDirectEmployees: directEmployee.length,
      },
      employee: {
        totalEmployees,
        totalBench,
        totalDirectEmployees: directEmployee.length,
        totalShadowEmployees: shadowEmployee.length,
        totalInterns
      }
    }
  }
  async chartData() {
    let employeeBar = []
    let projectStatus = []
    const designationGroupby = await this.prismaService.groupBy(TABLES.EMPLOYEE,{
        by: ['designationId'],
        _count: true
    })
    const projectByStatus = await this.prismaService.groupBy(TABLES.PROJECT, {
      by: ['projectStatus'],
      _count: true
    })
    for (let i = 0; i < designationGroupby.length; i++) {
        const designationData = designationGroupby[i];
        const designation = await this.prismaService.findUnique(TABLES.DESIGNATION,{
            where: {id: designationData.designationId}
        })
        employeeBar = [
            ...employeeBar,
            {
                label: designation.name,
                count: designationData._count
            }
        ]
        
    }
    for (let i = 0; i < projectByStatus.length; i++) {
      const projectStatu = projectByStatus[i];

      projectStatus = [
          ...projectStatus,
          {
              label: projectStatu.projectStatus,
              count: projectStatu._count
          }
      ]
      
  }
    return {
      employeeBar,
      projectStatus
    }
  }
}
