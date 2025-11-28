import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserScore } from './user-score.entity';
import { Submission } from '../../submissions/entities/submission.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ default: 0 })
    totalScore: number; // 현재 총점

    // [관계] 유저는 여러 개의 점수 기록을 가질 수 있다.
    @OneToMany(() => UserScore, (score) => score.user)
    scoreLogs: UserScore[];

    // [관계] 유저는 여러 번 답을 제출할 수 있다.
    @OneToMany(() => Submission, (submission) => submission.user)
    submissions: Submission[];
}