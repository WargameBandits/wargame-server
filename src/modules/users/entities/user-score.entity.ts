import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserScore {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 0 })
    totalScore: number; // 총점

    @Column({ default: 0 })
    solvedCount: number; // 푼 문제 수

    @UpdateDateColumn()
    lastSolvedAt: Date; // 마지막으로 문제를 푼 시간 (동점자 처리용)

    // [관계] 이 점수판의 주인은 누구인가?
    @OneToOne(() => User, (user) => user.scoreInfo)
    @JoinColumn() // 1:1 관계의 주인 쪽에 붙임
    user: User;
}