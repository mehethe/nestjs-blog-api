import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRootRoute(): { message: string } {
    return { message: 'API is running....' };
  }
}
