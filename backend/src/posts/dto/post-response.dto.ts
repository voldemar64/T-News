import { UserResponseDto } from '../../users/dto/user-response.dto';
import { CommentResponseDto } from '../../comments/dto/comment-response.dto';

export class PostResponseDto {
  id: string;
  userId: string;
  content: string;
  likes: number;
  comments?: CommentResponseDto[];
  user?: UserResponseDto;
}
