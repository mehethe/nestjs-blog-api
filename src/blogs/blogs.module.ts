import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { BlogOwnerGuard } from 'src/auth/guard/blog-owner.guard';

@Module({
  controllers: [BlogsController],
  providers: [BlogsService, BlogOwnerGuard],
})
export class BlogsModule {}
