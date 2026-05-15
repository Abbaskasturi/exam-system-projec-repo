import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ExamAttempt } from './exam-attempt.entity';
import { Question } from '../../questions/question.entity';

@Entity('rough_work_uploads')
export class RoughWork {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'attempt_id' })
  attempt_id: number;

  @ManyToOne(() => ExamAttempt)
  @JoinColumn({ name: 'attempt_id' })
  attempt: ExamAttempt;

  @Column({ name: 'question_id', nullable: true })
  question_id: number;

  @ManyToOne(() => Question)
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @Column({ type: 'text' })
  file_url: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  uploaded_at: Date;
}
