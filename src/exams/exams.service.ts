import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from './exam.entity';
import * as crypto from 'crypto';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam)
    private examRepository: Repository<Exam>,
  ) {}

  async createExam(instituteId: number, examData: Partial<Exam>): Promise<{ exam: Exam; link: string }> {
    const examLink = crypto.randomUUID();
    
    const newExam = this.examRepository.create({
      ...examData,
      institute_id: instituteId,
      exam_link: examLink,
    });

    const savedExam = await this.examRepository.save(newExam);
    
    // Assuming frontend runs on http://localhost:3001 or similar, we construct the link
    // The exact domain might need to come from environment variables in a real app
    const dashboardLink = `http://localhost:3000/exam/${examLink}`;
    
    return {
      exam: savedExam,
      link: dashboardLink
    };
  }

  async getExamByLink(examLink: string): Promise<Exam> {
    const exam = await this.examRepository.findOne({ where: { exam_link: examLink } });
    if (!exam) {
      throw new NotFoundException('Exam not found or invalid link');
    }
    return exam;
  }
}
