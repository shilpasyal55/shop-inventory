import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { RightsService } from '../rights/rights.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly rightsService: RightsService
    ) { }

    // @UseGuards(AuthGuard('jwt'))
    @Post('create')
    async createUser(@Body() createUserDto: CreateUserDto) {
        const newUser = await this.usersService.createUser(createUserDto);
        return newUser; // Return user data without the password
    }

    // Login endpoint with JWT token and rights
    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        const result = await this.usersService.validateUser(body.email, body.password);

        if (result) {
            return result; // Return token and user without password, plus rights
        } else {
            return { message: 'Invalid credentials' };
        }
    }

    // Get rights for a user
    @Get(':id/rights')
    async getUserRights(@Param('id') id: string) {
        const rights = await this.rightsService.findUserRights(+id);
        return rights;
    }
}
