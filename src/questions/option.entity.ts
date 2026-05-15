import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Question } from './question.entity';
import { ExamAttempt } from '../submissions/entities/exam-attempt.entity';

@Entity('options')
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'attempt_id', nullable: true })
  attempt_id: number;

  @ManyToOne(() => ExamAttempt)
  @JoinColumn({ name: 'attempt_id' })
  attempt: ExamAttempt;

  @Column({ name: 'question_id' })
  question_id: number;

  @ManyToOne(() => Question)
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @Column({ type: 'varchar', length: 10 })
  selected_option: string; // The student's choice (a, b, c, d)
}
