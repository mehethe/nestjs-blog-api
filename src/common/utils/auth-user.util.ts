import { User } from '@prisma/client';
import { JwtService } from 'src/auth/jwt/jwt.service';

export function generateAuthData(user: User, jwtService: JwtService) {
  const token = jwtService.generateToken(user.id);

  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token,
  };

  return userData;
}
