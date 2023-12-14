import {
    Controller,
    Get,
    Post,
    Put,
    Query,
    Delete,
    Param,
    Body,
    HttpStatus,
    Req
} from '@nestjs/common';
import {
    ApiResponse,
    ApiQuery,
    ApiTags
} from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { ProjectResponseDto } from './entities/project.entity';


@ApiTags("Project")
@Controller('project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) { }

    @Get('/')
    @Get('/')
    @ApiQuery({
        name: 'search',
        required: false,
    })
    @ApiQuery({
        name: 'limit',
        required: false,
    })
    @ApiQuery({
        name: 'page',
        required: false,
    })
    @ApiQuery({
        name: 'ids',
        required: false,
    })
    @ApiQuery({
        name: 'filter',
        required: false,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Projects Successfully Fetched',
    })
    async getProjects(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('search') search: string,
        @Query('ids') ids: string,
        @Query('filter') filter: string,
    ): Promise<ProjectResponseDto> {
        return this.projectService.getProjects(
            page,
            limit,
            search,
            ids ? JSON.parse(ids) : [],
            filter ? JSON.parse(filter) : null
        )
    }
    
    @Get('/:id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Project Successfully Fetched',
    })
    async getProject(
        @Param('id') id: string
    ): Promise<ProjectResponseDto> {
        return this.projectService.getProject(id)
    }

    @Post('/')
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Projects Successfully Created',
    })
    async createProject(
        @Body() data: CreateProjectDto
    ): Promise<ProjectResponseDto> {
        return this.projectService.createProject(data)
    }

    @Put('/:id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Projects Successfully Updated',
    })
    async updateProject(
        @Param('id') id: string,
        @Body() data: UpdateProjectDto
    ): Promise<ProjectResponseDto> {
        return this.projectService.updateProject(id, data)
    }

    @Delete('/:id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Projects Successfully Deleted',
    })
    async deleteProject(
        @Param('id') id: string
    ): Promise<ProjectResponseDto> {
        return this.projectService.deleteProject(id)
    }
}
