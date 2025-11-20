import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Challenge {
    @PrimaryGeneratedColumn()
    id: number; // 문제 고유 번호 

    @Column()
    title: string; // 문제 제목 

    @Column()
    description: string; // 문제 설명

    @Column()
    score: number; // 점수

    @Column()
    flag: string; // 정답

    @Column()
    category: string; // 분야 
}