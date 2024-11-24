import { Global, Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { JwtService } from 'src/auth/jwt/jwt.service';
import { LoggerService } from './logger/logger.service';

@Global() // Makes the module globally available
@Module({
  providers: [PrismaService, JwtService, LoggerService],
  exports: [PrismaService, JwtService, LoggerService],
})
export class SharedModule {}
