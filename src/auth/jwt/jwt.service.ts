import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/shared/database/prisma.service';

@Injectable()
export class JwtService {
  private readonly jwtSecret: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET');
    if (!this.jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables.');
    }
  }

  /**
   * Verifies a token and decodes its payload.
   * @param token The JWT token to verify.
   * @returns Decoded token payload.
   * @throws UnauthorizedException if the token is invalid or expired.
   */
  async verifyToken(token: string): Promise<{ id: string }> {
    try {
      return jwt.verify(token, this.jwtSecret) as { id: string };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException('Token has expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      }
      throw new UnauthorizedException('Unable to verify token');
    }
  }

  /**
   * Retrieves the user from the database using the decoded token.
   * @param token The JWT token.
   * @returns The user associated with the token.
   * @throws UnauthorizedException if the user is not found or the token is invalid.
   */
  async getUserFromToken(token: string) {
    const decoded = await this.verifyToken(token);

    const user = await this.prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, isAdmin: true, email: true, name: true }, // Adjust selection as needed
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  /**
   * Generates a new JWT token.
   * @param id The user ID.
   * @param expiresIn Expiration time for the token (default: 30 days).
   * @param additionalPayload Additional claims to include in the token.
   * @returns The signed JWT token.
   */
  generateToken(
    id: string,
    expiresIn = '30d',
    additionalPayload: Record<string, any> = {},
  ): string {
    return jwt.sign({ id, ...additionalPayload }, this.jwtSecret, {
      expiresIn,
    });
  }
}
