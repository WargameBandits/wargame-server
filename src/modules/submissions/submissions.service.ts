import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Submission } from './entities/submission.entity';
import { Challenge } from '../challenges/entities/challenge.entity';
import { User } from '../users/entities/user.entity';
import { UserScore } from '../users/entities/user-score.entity'; // ★ 추가

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission) private submissionRepo: Repository<Submission>,
    @InjectRepository(Challenge) private challengeRepo: Repository<Challenge>,
    @InjectRepository(User) private userRepo: Repository<User>,
    // UserScore는 트랜잭션 안에서 쓸 거라 레포지토리 주입 안 해도 되지만, 
    // 필요하면 @InjectRepository(UserScore) private scoreRepo... 추가
    private dataSource: DataSource,
  ) { }

  async create(dto: any) { // DTO 일단 any
    const { challengeId, userId, inputFlag } = dto;

    const challenge = await this.challengeRepo.findOneBy({ id: challengeId });
    if (!challenge) throw new NotFoundException('문제 없음');

    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('유저 없음');

    // 1. 정답 확인 (flag -> flagHash)
    const isCorrect = challenge.flagHash === inputFlag;

    // 2. 중복 제출 확인
    if (isCorrect) {
      const exists = await this.submissionRepo.findOne({
        where: { user: { id: userId }, challenge: { id: challengeId }, isCorrect: true }
      });
      if (exists) throw new BadRequestException('이미 푼 문제입니다.');
    }

    // 3. 트랜잭션 시작
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // (1) 제출 기록 저장
      const submission = this.submissionRepo.create({
        user,
        challenge,
        isCorrect,
        // inputFlag 필드는 엔티티에서 뺐다면 여기서도 제거
      });
      await queryRunner.manager.save(submission);

      // (2) 정답이면 -> UserScore 테이블 업데이트!
      if (isCorrect) {
        // UserScore 테이블에서 해당 유저의 점수를 찾아서 업데이트
        // (주의: User 테이블이 아니라 UserScore 테이블입니다!)
        await queryRunner.manager.increment(UserScore, { user: { id: userId } }, 'totalScore', challenge.points);
        await queryRunner.manager.increment(UserScore, { user: { id: userId } }, 'solvedCount', 1);

        // 마지막 해결 시간 업데이트
        await queryRunner.manager.update(UserScore, { user: { id: userId } }, { lastSolvedAt: new Date() });
      }

      await queryRunner.commitTransaction();
      return { success: isCorrect, earnedPoints: isCorrect ? challenge.points : 0 };

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}