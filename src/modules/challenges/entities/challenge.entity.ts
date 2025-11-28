import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { ChallengeFile } from './challenge-file.entity';
import { Submission } from '../../submissions/entities/submission.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Challenge {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column()
    flagHash: string;

    @Column()
    points: number;

    // ★★★ [여기 추가] 이 부분이 빠져서 에러가 났던 겁니다!
    @Column()
    category: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User)
    creator: User;

    @OneToMany(() => ChallengeFile, (file) => file.challenge)
    files: ChallengeFile[];

    @OneToMany(() => Submission, (submission) => submission.challenge)
    submissions: Submission[];
}