import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogStatus } from './blog-status.enum';
import { CreateBlogDto } from './dto/create-blog.dto';
import { GetAllBlogsDto } from './dto/get-all-blogs.dto';
import { PrismaService } from 'src/shared/database/prisma.service';
import { Blog, Prisma, Status } from '@prisma/client';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { AuthUser } from 'src/auth/auth-user.model';

@Injectable()
export class BlogsService {
  constructor(private prisma: PrismaService) {}

  async getAllBlogs(getAllBlogsDto: GetAllBlogsDto): Promise<{
    success: boolean;
    message: string;
    data: Blog[];
  }> {
    const { status, search, author } = getAllBlogsDto;

    const query: Prisma.BlogWhereInput = {
      deletedAt: null,
    };

    if (status) {
      query.status = status;
    }

    if (author) {
      query.authorId = author;
    }

    if (search) {
      query.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          content: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const blogs = await this.prisma.blog.findMany({
      where: query,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      success: true,
      message: `Blogs fetched successfully.`,
      data: blogs,
    };
  }

  async getBlogById(id: string): Promise<{
    success: boolean;
    message: string;
    data: Blog;
  }> {
    const blog = await this.prisma.blog.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`); //default Not Found
    }

    return {
      success: true,
      message: `Blog fetched successfully`,
      data: blog,
    };
  }

  async createBlog(
    createBlogDto: CreateBlogDto,
    user: AuthUser,
  ): Promise<{
    success: boolean;
    message: string;
    data: Blog;
  }> {
    const { title, cover, content } = createBlogDto;

    const blog = await this.prisma.blog.create({
      data: {
        authorId: user.id,
        title,
        cover,
        content,
      },
    });

    return {
      success: true,
      message: `Blog created successfully`,
      data: blog,
    };
  }

  async deleteBlog(id: string): Promise<{
    success: boolean;
    message: string;
    data: null;
  }> {
    await this.prisma.blog.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return {
      success: true,
      message: `Blog deleted successfully`,
      data: null,
    };
  }

  async updateBlogStatus(
    id: string,
    status: BlogStatus,
  ): Promise<{
    success: boolean;
    message: string;
    data: Blog;
  }> {
    await this.getBlogById(id);
    const blog = await this.prisma.blog.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    return {
      success: true,
      message: `Blog status updated successfully`,
      data: blog,
    };
  }

  async updateBlog(
    id: string,
    updateBlogDto: UpdateBlogDto,
  ): Promise<{
    success: boolean;
    message: string;
    data: Blog;
  }> {
    const { title, content, cover } = updateBlogDto;

    const result = await this.prisma.blog.update({
      where: {
        id,
      },
      data: {
        title,
        content,
        cover,
        status: Status.PENDING, //changed to public so that admin can review again
      },
    });

    return {
      success: true,
      message: `Blog updated successfully`,
      data: result,
    };
  }
}
