import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity'; // User import 필수
import { Challenge } from '../challenges/challenge.entity';


@Entity()
export class FirstBlood {
  @PrimaryGeneratedColumn()
  id: number;

  // 1. 어떤 문제의 퍼스트 블러드인가? (1:1)
  @OneToOne(() => Challenge)
  @JoinColumn({ name: 'challenge_id' })
  challenge: Challenge;

  // 2. 누가 땄는가? (수정된 부분!)
  // 기존: @Column({ name: 'user_id' }) userId: number; (단순 숫자)
  // 수정: User 엔티티와 진짜로 연결 (객체)
  @ManyToOne(() => User, (user) => user.firstBloods)
  @JoinColumn({ name: 'user_id' }) // DB 컬럼 이름은 그대로 user_id 유지
  user: User; // <-- 변수 이름이 'user'여야 Service에서 찾을 수 있음

  // 3. 언제 땄는가?
  @CreateDateColumn({ name: 'solved_at' })
  solvedAt: Date;
}