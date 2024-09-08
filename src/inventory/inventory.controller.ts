import { Controller, Get, Post, Param, Body, UseGuards, Request, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateInventoryDto } from './dto/create-inventory.dto';

@Controller('inventory')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    // Endpoint to get all inventory
    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getAllInventory() {
        try {
            return await this.inventoryService.findAll();
        } catch (error) {
            console.error('Error fetching inventory:', error);
            throw new InternalServerErrorException('Failed to fetch inventory');
        }
    }

    // Endpoint to get a single inventory item by ID
    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async getInventoryById(@Param('id') id: string) {
        try {
            return await this.inventoryService.findOne(+id);
        } catch (error) {
            console.error('Error fetching inventory item by ID:', error);
            throw new InternalServerErrorException('Failed to fetch inventory item');
        }
    }

    // Endpoint to create a new inventory item
    @UseGuards(AuthGuard('jwt'))
    @Post()
    async createInventory(@Body() inventoryData: CreateInventoryDto, @Request() req: any) {
        try {
            const userId = req.user.id;

            // Check if user has 'edit' rights
            const hasEditRights = await this.inventoryService.checkUserEditRights(userId);

            if (!hasEditRights) {
                throw new ForbiddenException('You do not have permission to create inventory.');
            }

            return await this.inventoryService.create(inventoryData);
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw error; // Rethrow ForbiddenException to preserve status code and message
            }

            console.error('Error creating inventory:', error);
            throw new InternalServerErrorException('Failed to create inventory');
        }
    }
}
