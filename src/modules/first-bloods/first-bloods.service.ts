import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FirstBlood } from './entities/first-blood.entity';
import { User } from '../users/entities/user.entity';
import { Challenge } from '../challenges/entities/challenge.entity';

@Injectable()
export class FirstBloodsService { // 클래스명에 s 붙음
  constructor(
    @InjectRepository(FirstBlood)
    private firstBloodRepo: Repository<FirstBlood>,
  ) { }

  // 퍼블 체크 및 등록
  async checkAndRegister(challenge: Challenge, user: User, manager: any) {
    const exists = await this.firstBloodRepo.findOne({
      where: { challenge: { id: challenge.id } },
    });

    if (exists) return false;

    const newFirstBlood = this.firstBloodRepo.create({
      challenge,
      user,
    });

    await manager.save(newFirstBlood);
    return true;
  }
  async getFirstBloodByChallenge(challengeId: number) {
    return await this.firstBloodRepo.findOne({
      where: { challenge: { id: challengeId } },
      relations: ['user'], // 주인공(User) 정보도 같이 가져옴
      select: {
        id: true,
        achievedAt: true,
        user: {
          id: true,
          username: true, // 유저 이름만 공개
        }
      }
    });
  }
}