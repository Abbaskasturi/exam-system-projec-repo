import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('institutes')
export class Institute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 250 })
  name: string;

  @Column({ length: 250, unique: true })
  email: string;

  @PrimaryColumn({ type: 'varchar', length: 250 })
  subdomain: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;
}
