import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Student } from './student.entity';
import * as crypto from 'crypto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    private jwtService: JwtService,
  ) {}

  async createStudent(instituteId: number, studentData: Partial<Student>): Promise<{ student: Student; access_token: string }> {
    // Generate a unique student ID like STU-A1B2C3D4
    const generatedStudentId = `STU-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const newStudent = this.studentRepository.create({
      ...studentData,
      institute_id: instituteId,
      student_id: generatedStudentId,
    });

    const savedStudent = await this.studentRepository.save(newStudent);

    // Generate JWT token for the student
    const payload = { email: savedStudent.email, sub: savedStudent.id, role: 'student' };
    const access_token = this.jwtService.sign(payload);

    return {
      student: savedStudent,
      access_token,
    };
  }

  async getStudentsByInstitute(instituteId: number): Promise<Student[]> {
    return await this.studentRepository.find({
      where: { institute_id: instituteId },
      order: { created_at: 'DESC' },
    });
  }
}
