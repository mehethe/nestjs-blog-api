import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { compareHash, generateHash } from 'src/common/utils/hash.util';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from './jwt/jwt.service';
import { AuthUser } from './auth-user.model';
import { generateAuthData } from 'src/common/utils/auth-user.util';
import { LoggerService } from 'src/shared/logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private loggerService: LoggerService,
  ) {}

  async signUp(
    createUserDto: CreateUserDto,
  ): Promise<{ success: boolean; message: string; data: AuthUser }> {
    const { name, email, password } = createUserDto;

    const hashedPassword = await generateHash(password);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const authUser = generateAuthData(user, this.jwtService);

    return {
      success: true,
      message: 'User created successfully',
      data: authUser,
    };
  }

  async signIn(
    signInDto: SignInDto,
  ): Promise<{ success: boolean; message: string; data: AuthUser }> {
    const { email, password } = signInDto;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user && (await compareHash(password, user.password))) {
      const authUser = generateAuthData(user, this.jwtService);
      return {
        success: true,
        message: 'Signed in successfully',
        data: authUser,
      };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
