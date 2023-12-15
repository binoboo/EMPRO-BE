import {
    Injectable,
    OnModuleInit,
    UnprocessableEntityException
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        await this.$connect();
    }

    async enableShutdownHooks() {
        await this.$disconnect();
    }
    //dynamic queries
    async create(tablename: string, data: object) {
        try {
            return await this[tablename].create({
                data: data,
            });
        } catch (error: any) {
            throw new UnprocessableEntityException(error?.message);
        }
    }
    async createMany(tablename: string, data: any) {
        try {
            return await this[tablename].createMany({
                data: data,
            });
        } catch (error: any) {
            throw new UnprocessableEntityException(error?.message);
        }
    }
    async createManywithUptions(tablename: string, data: any) {
        try {
            return await this[tablename].createMany(data);
        } catch (error: any) {
            throw new UnprocessableEntityException(error?.message);
        }
    }

    async update(tablename: string, queryandData: object) {
        try {
            return await this[tablename].update(queryandData);
        } catch (error: any) {
            throw new UnprocessableEntityException(error?.message);
        }
    }
    async updateMany(tablename: string, queryandData: object) {
        try {
            return await this[tablename].updateMany(queryandData);
        } catch (error: any) {
            throw new UnprocessableEntityException(error?.message);
        }
    }

    async findMany(tablename: string, query: object) {
        try {
            return await this[tablename].findMany(query);
        } catch (error: any) {
            throw new UnprocessableEntityException(error?.message);
        }
    }

    async count(tablename: string, query: object) {
        try {
            return await this[tablename].count(query);
        } catch (error: any) {
            throw new UnprocessableEntityException(error?.message);
        }
    }

    async findUnique(tablename: string, query: object) {
        try {
            return await this[tablename].findUnique(query);
        } catch (error: any) {
            throw new UnprocessableEntityException(error?.message);
        }
    }
    async groupBy(tablename: string, query: object) {
        try {
            return await this[tablename].groupBy(query);
        } catch (error: any) {
            throw new UnprocessableEntityException(error?.message);
        }
    }

    async findfirst(tablename: string, query: object) {
        try {
            return await this[tablename].findFirst(query);
        } catch (error: any) {
            throw new UnprocessableEntityException(error?.message);
        }
    }

    async delete(tablename: string, query: object) {
        try {
            return await this[tablename].delete(query);
        } catch (error: any) {
            throw new UnprocessableEntityException(error?.message);
        }
    }
    async deleteMany(tablename: string, query: object) {
        try {
            return await this[tablename].deleteMany(query);
        } catch (error: any) {
            throw new UnprocessableEntityException(error?.message);
        }
    }
}  