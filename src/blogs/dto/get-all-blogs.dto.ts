import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BlogStatus } from '../blog-status.enum';

export class GetAllBlogsDto {
  @IsOptional()
  @IsEnum(BlogStatus)
  status?: BlogStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  author?: string;
}
