import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from 'src/auth/jwt.service';

@Global() // Makes the module globally available
@Module({
  providers: [PrismaService, JwtService],
  exports: [PrismaService, JwtService],
})
export class SharedModule {}
