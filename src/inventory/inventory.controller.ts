import { Controller, Get, Post, Param, Body, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('inventory')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    // Endpoint to get all inventory
    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getAllInventory() {
        return this.inventoryService.findAll();
    }

    // Endpoint to get a single inventory item by ID
    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async getInventoryById(@Param('id') id: string) {
        return this.inventoryService.findOne(+id);
    }

    // Endpoint to create a new inventory item
    @UseGuards(AuthGuard('jwt'))
    @Post()
    async createInventory(@Body() inventoryData: any, @Request() req: any) {
        const userId = req.user.id;
        // Check if user has 'edit' rights
        const hasEditRights = await this.inventoryService.checkUserEditRights(userId);

        if (!hasEditRights) {
            throw new ForbiddenException('You do not have permission to create inventory.');
        }

        return this.inventoryService.create(inventoryData);
    }
}
