import { IsEnum } from 'class-validator';
import { BlogStatus } from '../blog-status.enum';

export class UpdateBlogStatusDto {
  @IsEnum(BlogStatus, { message: 'not a valid status' })
  status: BlogStatus;
}
