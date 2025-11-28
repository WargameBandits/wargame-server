import { Entity, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Challenge } from '../../challenges/entities/challenge.entity';

@Entity()
export class FirstBlood { // 엔티티 클래스 이름은 보통 단수형을 씁니다.
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  achievedAt: Date;

  @OneToOne(() => Challenge)
  @JoinColumn()
  challenge: Challenge;

  @ManyToOne(() => User)
  user: User;
}