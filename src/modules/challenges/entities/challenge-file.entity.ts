import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Challenge } from './challenge.entity';

@Entity()
export class ChallengeFile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fileUrl: string; // S3 링크 등

    @Column()
    originalName: string; // 사용자가 올린 원래 파일명

    @Column()
    size: number; // 파일 크기 (bytes)

    @CreateDateColumn()
    uploadedAt: Date;

    @ManyToOne(() => Challenge, (challenge) => challenge.files)
    challenge: Challenge;
}