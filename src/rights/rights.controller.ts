import { Controller, Post, Body, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { RightsService } from './rights.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateRightsDto } from './dto/create-rights.dto';

@Controller('rights')
export class RightsController {
    constructor(private readonly rightsService: RightsService) { }

    // Single endpoint for upserting user rights
    @UseGuards(AuthGuard('jwt'))
    @Post()
    async upsertUserRights(@Body() rightsData: CreateRightsDto, @Request() req: any) {
        const adminId = req.user.userId;

        // Check if the user has permission to assign or modify rights
        const hasPermission = await this.rightsService.checkAdminRights(adminId);
        if (!hasPermission) {
            throw new ForbiddenException('You do not have permission to assign or update rights.');
        }

        // Upsert the rights (create or update)
        return this.rightsService.upsertRights(rightsData);
    }
}
