import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './question.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
  ) {}

  async createQuestion(instituteId: number, imageUrl: string, difficultyLevel: string): Promise<Question> {
    const question = this.questionsRepository.create({
      institute_id: instituteId,
      image_url: imageUrl,
      difficulty_level: difficultyLevel,
    });
    return this.questionsRepository.save(question);
  }
}
