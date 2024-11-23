import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { GetAllBlogsDto } from './dto/get-all-blogs.dto';
import { UpdateBlogStatusDto } from './dto/update-blog-status.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { ProtectGuard } from 'src/auth/guard/protect.guard';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AuthUser as AuthUserType } from 'src/auth/auth-user.model';
import { AdminGuard } from 'src/auth/guard/admin.guard';
import { BlogOwnerGuard } from 'src/auth/guard/blog-owner.guard';
import { createOrGuard } from 'src/auth/guard/or.guard';

@Controller('blogs')
export class BlogsController {
  constructor(private blogsService: BlogsService) {}

  @Get()
  getAllBlogs(@Query() getAllBlogsDto: GetAllBlogsDto) {
    return this.blogsService.getAllBlogs(getAllBlogsDto);
  }

  @Get('/:id')
  getBlogById(@Param('id') id: string) {
    return this.blogsService.getBlogById(id);
  }

  @Post()
  @UseGuards(ProtectGuard)
  createBlog(
    @Body() createBlogDto: CreateBlogDto,
    @AuthUser() user: AuthUserType,
  ) {
    return this.blogsService.createBlog(createBlogDto, user);
  }

  @Delete('/:id')
  @UseGuards(ProtectGuard, createOrGuard([BlogOwnerGuard, AdminGuard]))
  deleteBlog(@Param('id') id: string) {
    return this.blogsService.deleteBlog(id);
  }

  @Patch('/:id/status')
  @UseGuards(ProtectGuard, AdminGuard)
  updateBlogStatus(
    @Param('id') id: string,
    @Body() updateBlogStatusDto: UpdateBlogStatusDto,
  ) {
    const { status } = updateBlogStatusDto;

    return this.blogsService.updateBlogStatus(id, status);
  }

  @Patch('/:id')
  @UseGuards(ProtectGuard, BlogOwnerGuard)
  upadteBlog(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogsService.updateBlog(id, updateBlogDto);
  }
}
