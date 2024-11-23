import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '../jwt.service';

@Injectable()
export class ProtectGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Not authorized, no token');
    }

    const token = authHeader.split(' ')[1];
    try {
      const user = await this.jwtService.getUserFromToken(token);
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Not authorized, token failed');
    }
  }
}
