import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Institute } from '../institutes/institute.entity';

@Entity('exams')
export class Exam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'institute_id' })
  institute_id: number;

  @ManyToOne(() => Institute)
  @JoinColumn({ name: 'institute_id' })
  institute: Institute;

  @Column({ type: 'varchar', length: 250 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  course: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'int' })
  duration_minute: number;

  @Column({ type: 'int' })
  total_marks: number;

  @Column({ type: 'timestamp with time zone' })
  start_time: Date;

  @Column({ type: 'timestamp with time zone' })
  end_time: Date;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'text', nullable: true })
  exam_link: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;
}
