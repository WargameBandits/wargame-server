import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Challenge } from '../../challenges/entities/challenge.entity';

@Entity()
export class Submission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    isCorrect: boolean; // 정답 여부

    @CreateDateColumn()
    submittedAt: Date;

    // 누가?
    @ManyToOne(() => User, (user) => user.submissions)
    user: User;

    // 어떤 문제를?
    @ManyToOne(() => Challenge, (challenge) => challenge.submissions)
    challenge: Challenge;
}