import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RequestUser } from '../common/interfaces/request-user.interface';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    hashPassword(password: string): Promise<string>;
    comparePassword(password: string, hashedPassword: string): Promise<boolean>;
    validateUser(username: string, password: string): Promise<RequestUser>;
    login(user: RequestUser): Promise<{
        access_token: string;
        user: {
            id: string;
            username: string;
            avatar: string;
            bio: string;
        };
    }>;
}
