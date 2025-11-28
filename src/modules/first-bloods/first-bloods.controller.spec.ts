import { Test, TestingModule } from '@nestjs/testing';
import { FirstBloodsController } from './first-bloods.controller';

describe('FirstBloodsController', () => {
  let controller: FirstBloodsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FirstBloodsController],
    }).compile();

    controller = module.get<FirstBloodsController>(FirstBloodsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
