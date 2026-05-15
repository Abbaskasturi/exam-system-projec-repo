import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from './exam.entity';
import { AnswerKey } from './entities/answer-key.entity';
import { KeyPaper } from './entities/key-paper.entity';
import * as crypto from 'crypto';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam)
    private examRepository: Repository<Exam>,
    @InjectRepository(AnswerKey)
    private answerKeyRepository: Repository<AnswerKey>,
    @InjectRepository(KeyPaper)
    private keyPaperRepository: Repository<KeyPaper>,
  ) {}

  async createKeyPaper(examId: number, keys: { question_number: number, correct_option: string }[]): Promise<KeyPaper[]> {
    const exam = await this.examRepository.findOne({ where: { id: examId } });
    if (!exam) throw new NotFoundException('Exam not found');

    // We can either update existing or delete and recreate. 
    // Given the simple structure, deleting and recreating is often easier for bulk uploads.
    await this.keyPaperRepository.delete({ exam_id: examId });

    const newKeys = keys.map(key => this.keyPaperRepository.create({
      exam_id: examId,
      question_number: key.question_number,
      correct_option: key.correct_option,
    }));

    return this.keyPaperRepository.save(newKeys);
  }

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

  async getExamsByInstitute(instituteId: number): Promise<Exam[]> {
    return this.examRepository.find({
      where: { institute_id: instituteId },
      order: { created_at: 'DESC' },
    });
  }

  async saveAnswerKeys(examId: number, keys: any[]): Promise<AnswerKey[]> {
    const exam = await this.examRepository.findOne({ where: { id: examId } });
    if (!exam) throw new NotFoundException('Exam not found');

    await this.answerKeyRepository.delete({ exam_id: examId });

    const newKeys = keys.map(key => this.answerKeyRepository.create({
      exam_id: examId,
      question_no: key.question_no,
      correct_option: key.correct_option,
      marks: key.marks || 1,
    }));

    return this.answerKeyRepository.save(newKeys);
  }

  async getAnswerKeys(examId: number): Promise<AnswerKey[]> {
    return this.answerKeyRepository.find({
      where: { exam_id: examId },
      order: { question_no: 'ASC' },
    });
  }
}
