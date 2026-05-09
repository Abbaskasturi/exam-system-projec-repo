import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import * as crypto from 'crypto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async createStudent(instituteId: number, studentData: Partial<Student>): Promise<Student> {
    // Generate a unique student ID like STU-A1B2C3D4
    const generatedStudentId = `STU-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const newStudent = this.studentRepository.create({
      ...studentData,
      institute_id: instituteId,
      student_id: generatedStudentId,
    });

    return await this.studentRepository.save(newStudent);
  }

  async getStudentsByInstitute(instituteId: number): Promise<Student[]> {
    return await this.studentRepository.find({
      where: { institute_id: instituteId },
      order: { created_at: 'DESC' },
    });
  }
}
