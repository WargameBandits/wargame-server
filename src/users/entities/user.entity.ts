import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number; // 유저 번호

    @Column()
    username: string; // 아이디

    @Column({ default: 0 })
    score: number; // 점수 (기본값 0)
}