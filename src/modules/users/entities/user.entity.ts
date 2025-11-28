import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany } from 'typeorm';
import { UserScore } from './user-score.entity';
import { Submission } from '../../submissions/entities/submission.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string; // 깃허브 아이디와 동일하게 사용

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    githubId: string; // ★ GitHub OAuth 필수 필드

    @Column({ default: 'user' }) // 'admin' | 'user'
    role: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // [관계] 유저 : 점수집계 = 1 : 1
    @OneToOne(() => UserScore, (score) => score.user)
    scoreInfo: UserScore;

    // [관계] 유저 : 제출기록 = 1 : N
    @OneToMany(() => Submission, (submission) => submission.user)
    submissions: Submission[];
}