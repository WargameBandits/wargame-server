import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Submission } from './entities/submission.entity';
import { Challenge } from '../challenges/entities/challenge.entity';
import { User } from '../users/entities/user.entity';
import { UserScore } from '../users/entities/user-score.entity';
// ★ 경로 및 이름 변경 (s 붙음)
import { FirstBloodsService } from '../first-bloods/first-bloods.service';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission) private submissionRepo: Repository<Submission>,
    @InjectRepository(Challenge) private challengeRepo: Repository<Challenge>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private dataSource: DataSource,
    // ★ 주입받는 서비스 이름 변경
    private readonly firstBloodsService: FirstBloodsService,
  ) { }

  async create(dto: any) {
    const { challengeId, userId, inputFlag } = dto;

    const challenge = await this.challengeRepo.findOneBy({ id: challengeId });
    if (!challenge) throw new NotFoundException('문제 없음');

    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('유저 없음');

    const isCorrect = challenge.flagHash === inputFlag;

    if (isCorrect) {
      const exists = await this.submissionRepo.findOne({
        where: { user: { id: userId }, challenge: { id: challengeId }, isCorrect: true }
      });
      if (exists) throw new BadRequestException('이미 푼 문제입니다.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const submission = this.submissionRepo.create({
        user,
        challenge,
        isCorrect,
      });
      await queryRunner.manager.save(submission);

      let earnedPoints = 0;
      let message = '오답입니다 ㅠㅠ';

      if (isCorrect) {
        earnedPoints = challenge.points;
        message = '정답입니다! 🎉';

        // ★ 이름 변경된 서비스 호출
        const isFirstBlood = await this.firstBloodsService.checkAndRegister(
          challenge,
          user,
          queryRunner.manager
        );

        if (isFirstBlood) {
          const bonus = Math.floor(challenge.points * 0.1);
          earnedPoints += bonus;
          message = `🩸 FIRST BLOOD! 🩸 (보너스 +${bonus}점)`;
        }

        await queryRunner.manager.increment(UserScore, { user: { id: userId } }, 'totalScore', earnedPoints);
        await queryRunner.manager.increment(UserScore, { user: { id: userId } }, 'solvedCount', 1);
        await queryRunner.manager.update(UserScore, { user: { id: userId } }, { lastSolvedAt: new Date() });
      }

      await queryRunner.commitTransaction();
      return { success: isCorrect, message, earnedPoints };

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}