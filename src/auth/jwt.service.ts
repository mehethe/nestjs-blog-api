import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  // Verifies a token and decodes it
  async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(
        token,
        this.configService.get('JWT_SECRET'),
      ) as {
        id: string;
      };
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  // Retrieves the user from the database using the decoded token
  async getUserFromToken(token: string) {
    const decoded = await this.verifyToken(token);

    const user = await this.prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, isAdmin: true, email: true, name: true }, // Customize as needed
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  // Generates a new token
  generateToken = (
    id: string,
    expiresIn = '30d', // Default expiration time
    additionalPayload: Record<string, any> = {}, // Allows adding custom fields to the token
  ): string => {
    if (!this.configService.get('JWT_SECRET')) {
      throw new Error('JWT_SECRET is not defined in environment variables.');
    }

    return jwt.sign(
      { id, ...additionalPayload }, // Include additional claims if provided
      this.configService.get('JWT_SECRET'),
      { expiresIn },
    );
  };
}
