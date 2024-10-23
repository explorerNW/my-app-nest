import { Test } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth.module';

describe('AuthGuard', () => {
  let jwtService: JwtService;
  let authService: AuthService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AuthModule],
      providers: [JwtService, AuthService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });
  it('should be defined', () => {
    jwtService = new JwtService({});
    expect(new AuthGuard(jwtService, authService)).toBeDefined();
  });
});
