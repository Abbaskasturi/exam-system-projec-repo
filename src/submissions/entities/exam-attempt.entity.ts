import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from '../../students/student.entity';
import { Exam } from '../../exams/exam.entity';

@Entity('exam_attempts')
export class ExamAttempt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'student_id' })
  student_id: number;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ name: 'exam_id' })
  exam_id: number;

  @ManyToOne(() => Exam)
  @JoinColumn({ name: 'exam_id' })
  exam: Exam;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  started_at: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  finished_at: Date;
}
