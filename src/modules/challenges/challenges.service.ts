import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Challenge } from './entities/challenge.entity';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectRepository(Challenge)
    private challengeRepo: Repository<Challenge>,
  ) { }

  // 문제 생성
  async create(data: any) {
    const newChallenge = this.challengeRepo.create({
      title: data.title,
      description: data.description,
      points: data.points,
      flagHash: data.flag,
      category: data.category, // 이제 에러 안 남!
      creator: { id: 1 },
    });
    return await this.challengeRepo.save(newChallenge);
  }

  // 목록 조회
  async findAll() {
    return await this.challengeRepo.find({
      // category가 엔티티에 있으니까 이제 에러 안 남!
      select: ['id', 'title', 'points', 'category', 'createdAt'],
    });
  }

  // 상세 조회
  async findOne(id: number) {
    return await this.challengeRepo.findOneBy({ id });
  }
}