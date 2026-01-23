import { UserResponseDto } from '../../users/dto/user-response.dto';
export declare class CommentResponseDto {
    id: string;
    userId: string;
    content: string;
    user?: UserResponseDto;
}
