import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { FollowsService } from '../follows/follows.service';
import { RequestUser } from '../common/interfaces/request-user.interface';
export declare class UsersController {
    private readonly usersService;
    private readonly followsService;
    constructor(usersService: UsersService, followsService: FollowsService);
    findAll(): Promise<UserResponseDto[]>;
    findOne(id: string): Promise<UserResponseDto>;
    create(createUserDto: CreateUserDto): Promise<UserResponseDto>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto>;
    follow(userId: string, req: {
        user: RequestUser;
    }): Promise<void>;
    unfollow(userId: string, req: {
        user: RequestUser;
    }): Promise<void>;
    getFollowing(userId: string): Promise<UserResponseDto[]>;
}
