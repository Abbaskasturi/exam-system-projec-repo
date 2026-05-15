import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Exam } from '../exam.entity';

@Entity('answer_keys')
export class AnswerKey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'exam_id' })
  exam_id: number;

  @ManyToOne(() => Exam)
  @JoinColumn({ name: 'exam_id' })
  exam: Exam;

  @Column({ type: 'int' })
  question_no: number; // The question number the student matches

  @Column({ type: 'varchar', length: 10 })
  correct_option: string; // The correct choice (a, b, c, d)

  @Column({ type: 'int', default: 1 })
  marks: number; // Points for this question
}
