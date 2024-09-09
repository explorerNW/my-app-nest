import { Test, TestingModule } from '@nestjs/testing';
import { MicroServiceController } from './micro-service.controller';

describe('MicroServiceController', () => {
  let controller: MicroServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MicroServiceController],
    }).compile();

    controller = module.get<MicroServiceController>(MicroServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
