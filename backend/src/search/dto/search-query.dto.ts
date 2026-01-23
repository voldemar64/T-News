import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class SearchQueryDto {
  @IsString()
  @IsNotEmpty()
  query: string;

  @IsEnum(['users', 'posts'])
  @IsNotEmpty()
  type: 'users' | 'posts';
}
