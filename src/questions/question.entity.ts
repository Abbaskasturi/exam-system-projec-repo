import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Institute } from '../institutes/institute.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'institute_id' })
  institute_id: number;

  @ManyToOne(() => Institute)
  @JoinColumn({ name: 'institute_id' })
  institute: Institute;

  @Column({ type: 'text' })
  image_url: string;

  @Column({ type: 'varchar', length: 50 })
  difficulty_level: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;
}