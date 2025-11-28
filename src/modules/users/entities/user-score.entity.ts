import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserScore {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    score: number; // 획득한 점수 (예: +100)

    @Column()
    reason: string; // 점수 획득 사유 (예: "문제 1번 정답")

    @CreateDateColumn()
    obtainedAt: Date; // 언제 얻었는지

    // [관계] 이 기록은 어떤 유저의 것인가?
    @ManyToOne(() => User, (user) => user.scoreLogs)
    user: User;
}