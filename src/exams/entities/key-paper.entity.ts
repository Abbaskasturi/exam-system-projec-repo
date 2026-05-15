import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Exam } from '../exam.entity';

@Entity('key_papers')
export class KeyPaper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'exam_id' })
  exam_id: number;

  @ManyToOne(() => Exam)
  @JoinColumn({ name: 'exam_id' })
  exam: Exam;

  @Column({ type: 'int' })
  question_number: number;

  @Column({ type: 'text' })
  correct_option: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;
}
