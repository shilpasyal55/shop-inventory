import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
    constructor(private prisma: PrismaService) { }

    async create(data: { productName: string; description?: string; totalQty: number; price: number }) {
        return this.prisma.inventory.create({
            data,
        });
    }

    // Check if user has edit rights
    async checkUserEditRights(userId: number): Promise<boolean> {
        const rights = await this.prisma.rights.findFirst({
            where: {
                userId: userId,
                edit: true,  // Check if the user has edit rights
            },
        });

        return !!rights;  // Return true if the user has edit rights
    }


    async findAll() {
        return this.prisma.inventory.findMany();
    }

    async findOne(id: number) {
        return this.prisma.inventory.findUnique({ where: { id } });
    }

    async updateInventory(id: number, data: { productName?: string; description?: string; totalQty?: number; price?: number }) {
        return this.prisma.inventory.update({
            where: { id },
            data,
        });
    }

    async removeInventory(id: number) {
        return this.prisma.inventory.delete({ where: { id } });
    }
}
