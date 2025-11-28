import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FirstBlood } from './first-blood.entity';

@Injectable() // "이건 서비스 로직입니다"라고 선언
export class FirstBloodsService {
  constructor(
    // DB랑 대화할 도구(Repository)를 주입받음
    @InjectRepository(FirstBlood)
    private readonly firstBloodRepository: Repository<FirstBlood>,
  ) {}

  /**
   * 퍼스트 블러드 처리 함수
   * (제출 담당 팀원이 이 함수를 호출할 예정)
   */
  async handleFirstBlood(challengeId: number, userId: number): Promise<void> {
    // 1. 이미 누군가 퍼스트 블러드를 가져갔는지 확인 (DB 조회)
    const exists = await this.firstBloodRepository.findOne({
      where: { challenge: { id: challengeId } }, // 관계된 Challenge의 ID로 검색
    });

    // 2. 이미 있으면? 아무것도 안 하고 종료 (쿨하게 리턴)
    if (exists) {
      return;
    }

    // 3. 없으면? 기록 저장
    try {
      // 저장할 객체 생성
      const newFirstBlood = this.firstBloodRepository.create({
  // TypeORM은 객체의 ID만 넣어줘도 알아서 연결해줍니다.
    challenge: { id: challengeId } as any, 
    user: { id: userId } as any, 
    });

      // DB에 저장 (INSERT)
      await this.firstBloodRepository.save(newFirstBlood);
      console.log(`🩸 First Blood! User ${userId} solved Challenge ${challengeId}`);
      
    } catch (error) {
      // 4. 동시성 처리 (Race Condition)
      // 0.001초 차이로 두 명이 동시에 들어왔을 때, 
      // DB의 Unique Constraint(유니크 제약) 때문에 뒤에 온 사람은 에러가 납니다.
      // 이건 서버 에러가 아니라 자연스러운 현상이므로 무시합니다.
    }
  }
  async getFirstBloodByChallenge(challengeId: number) {
    return this.firstBloodRepository.findOne({
      // 1. 조건: 해당 문제 ID(challengeId)와 일치하는 기록 찾기
      where: { challenge: { id: challengeId } }, 
      
      // 2. 관계: User 테이블도 같이 묶어서(JOIN) 가져오기
      // 이걸 안 하면 "누가" 풀었는지(닉네임)를 알 수가 없습니다.
      relations: ['user'], 

      // 3. 선택: 유저 정보 다 가져오면 비밀번호도 딸려오니까, 필요한 것만 쏙 골라오기
      select: {
        id: true,
        solvedAt: true,
        user: {
          id: true,
          username: true, // 닉네임만 보여주기!
        },
      },
    });
  }
}