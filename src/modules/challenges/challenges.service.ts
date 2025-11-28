import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { Challenge } from './entities/challenge.entity';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectRepository(Challenge)
    private challengeRepository: Repository<Challenge>, // DB 관리자(Repository) 소환
  ) { }

  // 1. 문제 생성 (POST)
  async create(createChallengeDto: CreateChallengeDto) {
    // 받은 데이터로 새 문제 객체를 만듭니다.
    const newChallenge = this.challengeRepository.create(createChallengeDto);
    // DB에 저장하고 결과를 반환합니다.
    return await this.challengeRepository.save(newChallenge);
  }

  // 2. 모든 문제 목록 조회 (GET)
  async findAll() {
    // DB에 있는 모든 문제를 찾아서 반환합니다.
    return await this.challengeRepository.find();
  }

  // 3. 특정 문제 하나 조회 (GET /:id)
  async findOne(id: number) {
    return await this.challengeRepository.findOneBy({ id });
  }

  update(id: number, updateChallengeDto: UpdateChallengeDto) {
    return `This action updates a #${id} challenge`;
  }

  remove(id: number) {
    return `This action removes a #${id} challenge`;
  }
  // 4. 정답 확인 기능 (핵심!)
  async checkFlag(id: number, submittedFlag: string): Promise<boolean> {
    // 1. 해당 문제를 DB에서 찾아옵니다.
    const challenge = await this.challengeRepository.findOneBy({ id });

    // 2. 문제가 없으면 false (에러 처리)
    if (!challenge) {
      return false;
    }

    // 3. DB에 저장된 flag와 사용자가 보낸 flag가 같은지 비교
    if (challenge.flag === submittedFlag) {
      return true; // 정답!
    } else {
      return false; // 땡!
    }
  }
}

