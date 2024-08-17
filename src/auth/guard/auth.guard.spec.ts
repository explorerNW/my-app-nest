import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('AuthGuard', () => {
  let jwtService: JwtService;
  it('should be defined', () => {
    jwtService = new JwtService({});
    expect(new AuthGuard(jwtService)).toBeDefined();
  });
});
