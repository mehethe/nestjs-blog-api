import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { BlogsService } from 'src/blogs/blogs.service';

@Injectable()
export class BlogOwnerGuard implements CanActivate {
  constructor(
    private readonly blogsService: BlogsService, // To fetch blog details
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assuming `ProtectGuard` adds `user` to the request object
    const blogId = request.params.id; // Blog ID from the route

    if (!user || !blogId) {
      throw new ForbiddenException('Access denied.');
    }

    // Fetch the blog by ID
    const blog = await this.blogsService.getBlogById(blogId);

    if (!blog || !blog.data) {
      throw new NotFoundException('Blog not found.');
    }

    // Check if the logged-in user is the owner
    if (blog.data.authorId !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to perform this action.',
      );
    }

    return true; // Access granted
  }
}
