import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RightsService {
    constructor(private readonly prisma: PrismaService) { }

    // Find user rights
    async findUserRights(userId: number) {
        return this.prisma.rights.findMany({
            where: { userId },
            include: { user: true },
        });
    }

    // Check if the user has admin rights (or other permissions)
    async checkAdminRights(userId: number) {
        const userRights = await this.prisma.rights.findFirst({
            where: { userId, edit: true },
        });

        return userRights ? true : false;
    }

    async upsertRights(rightsData: any) {
        return this.prisma.rights.upsert({
            where: { userId: rightsData.userId },
            update: {
                view: rightsData.view,
                edit: rightsData.edit,
            },
            create: {
                userId: rightsData.userId,
                view: rightsData.view,
                edit: rightsData.edit,
            },
        });
    }
}
