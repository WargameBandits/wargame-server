import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { Submission } from './entities/submission.entity';
import { Challenge } from '../challenges/entities/challenge.entity';
import { User } from '../users/entities/user.entity';
import { UserScore } from '../users/entities/user-score.entity';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private submissionRepo: Repository<Submission>,
    @InjectRepository(Challenge)
    private challengeRepo: Repository<Challenge>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private dataSource: DataSource, // 트랜잭션(여러 작업을 한 번에 처리)용
  ) { }

  async create(createSubmissionDto: CreateSubmissionDto) {
    const { challengeId, userId, inputFlag } = createSubmissionDto;

    // 1. 문제 정보 가져오기
    const challenge = await this.challengeRepo.findOneBy({ id: challengeId });
    if (!challenge) throw new NotFoundException('문제를 찾을 수 없습니다.');

    // 2. 유저 정보 가져오기
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다.');

    // 3. 정답 채점 (DB의 flag와 유저 입력값 비교)
    const isCorrect = challenge.flag === inputFlag;

    // 4. [중복 방지] 이미 맞춘 문제인지 확인
    // (정답인 경우에만 체크)
    if (isCorrect) {
      const existingSolve = await this.submissionRepo.findOne({
        where: {
          user: { id: userId },
          challenge: { id: challengeId },
          isCorrect: true
        }
      });

      if (existingSolve) {
        throw new BadRequestException('이미 푼 문제입니다! (점수 중복 지급 불가)');
      }
    }

    // 5. 트랜잭션 시작 (기록 저장 + 점수 업데이트를 동시에!)
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // (1) 제출 기록 저장 (정답이든 오답이든 기록은 남김)
      const submission = this.submissionRepo.create({
        inputFlag,
        isCorrect,
        user,
        challenge,
      });
      await queryRunner.manager.save(submission);

      // (2) 정답일 경우에만 -> 유저 점수 올려주고, 점수 로그 남기기
      if (isCorrect) {
        // 유저 총점 업데이트
        user.totalScore += challenge.score;
        await queryRunner.manager.save(user);

        // 점수 획득 로그 저장
        const scoreLog = new UserScore();
        scoreLog.user = user;
        scoreLog.score = challenge.score;
        scoreLog.reason = `문제 [${challenge.title}] 정답`;
        await queryRunner.manager.save(scoreLog);
      }

      // 모든 작업 확정 (Commit)
      await queryRunner.commitTransaction();

      // 결과 반환
      return {
        success: isCorrect,
        message: isCorrect ? '정답입니다! 🎉' : '오답입니다 ㅠㅠ',
        earnedScore: isCorrect ? challenge.score : 0,
      };

    } catch (err) {
      // 에러 나면 모든 작업 취소 (Rollback)
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}