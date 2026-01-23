import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { AuthService } from '../auth/auth.service';
export declare class UsersService {
    private readonly usersRepository;
    private readonly authService;
    constructor(usersRepository: UsersRepository, authService: AuthService);
    findAll(): Promise<UserResponseDto[]>;
    findById(id: string): Promise<UserResponseDto>;
    create(createUserDto: CreateUserDto): Promise<UserResponseDto>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto>;
    private toResponseDto;
}
