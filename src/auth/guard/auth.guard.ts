import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { jwtConstants } from '../constant';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService ) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException({ success: false, statusCode: 401, message: { authorization: false } });
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, { secret: jwtConstants.secret })
      request['user'] = payload;
    } catch(e) {
      throw new UnauthorizedException({ success: false, statusCode: 401, message: { authorization: false, logout: true, expired: true } });
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
