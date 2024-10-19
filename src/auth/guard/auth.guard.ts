import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { jwtConstants } from '../constant';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    try {
      const decodeToken: { id: string; email: string } = this.jwtService.decode(token);
      const exist = this.authService.tokenList
        .map((tokenValue) => {
          return this.jwtService.decode(tokenValue);
        })
        .map(
          (decodeValue: {
            id: string;
            email: string;
            iat: number;
            exp: number;
          }) => {
            return { id: decodeValue.id, email: decodeValue.email };
          },
        )
        .find(
          (decodeValue) =>
            decodeValue.id === decodeToken.id &&
            decodeValue.email === decodeToken.email,
        );
      if (!token || !exist) {
        throw new UnauthorizedException({
          success: false,
          statusCode: 401,
          message: { authorization: false },
        });
      }
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      request['user'] = payload;
    } catch (e) {
      throw new UnauthorizedException({
        success: false,
        statusCode: 401,
        message: { authorization: false, logout: true, expired: true },
      });
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
