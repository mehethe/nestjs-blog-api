import { IsNotEmpty } from 'class-validator';

export class UpdateBlogDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  cover: string;

  @IsNotEmpty()
  content: string;
}
