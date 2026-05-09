import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Institute } from '../institutes/institute.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'institute_id' })
  institute_id: number;

  @ManyToOne(() => Institute)
  @JoinColumn({ name: 'institute_id' })
  institute: Institute;

  @Column({ type: 'varchar', length: 50 })
  student_id: string;

  @Column({ type: 'varchar', length: 250 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  course: string;

  @Column({ type: 'varchar', length: 250 })
  year: string;

  @Column({ type: 'varchar', length: 250 })
  email: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;
}
