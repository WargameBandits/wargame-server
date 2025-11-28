import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ChallengeFile } from './challenge-file.entity';
import { Submission } from '../../submissions/entities/submission.entity';

@Entity()
export class Challenge {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    score: number; // 배점

    @Column()
    flag: string; // 정답

    @Column()
    category: string; // Web, Pwn 등

    // [관계] 한 문제는 여러 개의 첨부파일을 가질 수 있다.
    @OneToMany(() => ChallengeFile, (file) => file.challenge)
    files: ChallengeFile[];

    // [관계] 한 문제에 대해 여러 제출이 있을 수 있다.
    @OneToMany(() => Submission, (submission) => submission.challenge)
    submissions: Submission[];
}