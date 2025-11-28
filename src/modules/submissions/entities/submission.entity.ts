import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Challenge } from '../../challenges/entities/challenge.entity';

@Entity()
export class Submission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    inputFlag: string; // 유저가 입력한 답

    @Column()
    isCorrect: boolean; // 정답 여부 (true/false)

    @CreateDateColumn()
    submittedAt: Date; // 제출 시간

    // [관계] 누가 제출했나?
    @ManyToOne(() => User, (user) => user.submissions)
    user: User;

    // [관계] 어떤 문제를 풀었나?
    @ManyToOne(() => Challenge, (challenge) => challenge.submissions)
    challenge: Challenge;
}