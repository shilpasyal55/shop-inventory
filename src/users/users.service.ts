import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService, private jwtService: JwtService,
        private configService: ConfigService,

    ) { }

    async createUser(createUserDto: CreateUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10); // Hash the password
        const newUser = await this.prisma.user.create({
            data: {
                name: createUserDto.name,
                email: createUserDto.email,
                password: hashedPassword,
                isActive: createUserDto.isActive ?? true, // Default to active if not provided
            },
        });

        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword; // Return user data without the password
    }

    async findAll() {
        return this.prisma.user.findMany();
    }

    async findOne(id: number) {
        return this.prisma.user.findUnique({ where: { id } });
    }

    async updateUser(id: number, data: { name?: string; email?: string; password?: string; isActive?: boolean }) {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }

    async removeUser(id: number) {
        return this.prisma.user.delete({ where: { id } });
    }

    // Validate user credentials and generate JWT
    async validateUser(email: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: { rights: true }, // Include user's rights
        });

        if (user && bcrypt.compareSync(password, user.password)) {
            const { password, ...result } = user; // Exclude password from the result
            console.log('JWT_SECRET in AuthService:', this.configService.get<string>('JWT_SECRET')); // Log the secret

            const token = this.jwtService.sign({ id: user.id, email: user.email });

            return {
                token,
                user: result, // Return user without the password
            };
        }

        return null;
    }
}
