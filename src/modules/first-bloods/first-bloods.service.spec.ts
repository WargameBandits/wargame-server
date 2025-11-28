import { Test, TestingModule } from '@nestjs/testing';
import { FirstBloodsService } from './first-bloods.service';

describe('FirstBloodsService', () => {
  let service: FirstBloodsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirstBloodsService],
    }).compile();

    service = module.get<FirstBloodsService>(FirstBloodsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
