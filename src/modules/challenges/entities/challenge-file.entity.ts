import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Challenge } from './challenge.entity';

@Entity()
export class ChallengeFile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fileUrl: string; // 파일 다운로드 주소 (S3 링크 등)

    @Column()
    fileName: string; // 원본 파일명

    // [관계] 이 파일은 어떤 문제에 속하는가?
    @ManyToOne(() => Challenge, (challenge) => challenge.files)
    challenge: Challenge;
}