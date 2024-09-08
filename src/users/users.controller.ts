import { Controller, Post, Body, Get, Param, UseGuards, InternalServerErrorException, BadRequestException } from '@nestjs/common';
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
        try {
            const newUser = await this.usersService.createUser(createUserDto);
            return newUser; // Return user data without the password
        } catch (error) {
            if (error.code === 'P2002') {
                throw new BadRequestException('User with this email already exists');
            }

            // Generic error handling
            console.error('Error creating user:', error);
            throw new InternalServerErrorException('Failed to create user');
        }
    }

    // Login endpoint with JWT token and rights
    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        try {
            const result = await this.usersService.validateUser(body.email, body.password);

            if (result) {
                return result; // Return token and user without password, plus rights
            } else {
                return { message: 'Invalid credentials' };
            }
        } catch (error) {
            // Log the error and return a failure message
            console.error('Error during login:', error);
            throw new InternalServerErrorException('Login failed');
        }
    }

    // Get rights for a user
    @Get(':id/rights')
    async getUserRights(@Param('id') id: string) {
        try {
            const rights = await this.rightsService.findUserRights(+id);
            return rights;
        } catch (error) {
            // Log the error and throw an internal server error
            console.error('Error fetching user rights:', error);
            throw new InternalServerErrorException('Failed to retrieve user rights');
        }
    }
}
