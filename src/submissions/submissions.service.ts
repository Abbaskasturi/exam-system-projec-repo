import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { ExamAttempt } from './entities/exam-attempt.entity';
import { RoughWork } from './entities/submission.entity'; // This now maps to rough_work_uploads
import { Option } from '../questions/option.entity'; // This now maps to options (student choice)

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(ExamAttempt)
    private attemptRepository: Repository<ExamAttempt>,
    @InjectRepository(RoughWork)
    private roughWorkRepository: Repository<RoughWork>,
    @InjectRepository(Option)
    private optionRepository: Repository<Option>,
  ) {}

  async startAttempt(studentId: number, examId: number): Promise<ExamAttempt> {
    const attempt = this.attemptRepository.create({
      student_id: studentId,
      exam_id: examId,
    });
    return this.attemptRepository.save(attempt);
  }

  async submitAnswer(
    studentId: number,
    examId: number,
    questionId: number,
    selectedOption: string,
    roughWorkUrl: string,
  ): Promise<any> {
    // Find or create an active attempt for this student and exam
    let attempt = await this.attemptRepository.findOne({
      where: { student_id: studentId, exam_id: examId, finished_at: IsNull() },
    });

    if (!attempt) {
      attempt = this.attemptRepository.create({
        student_id: studentId,
        exam_id: examId,
      });
      attempt = await this.attemptRepository.save(attempt);
    }

    // 1. Save/Update the student's choice in the 'options' table
    let choice = await this.optionRepository.findOne({
      where: { attempt_id: attempt.id, question_id: questionId },
    });

    if (choice) {
      choice.selected_option = selectedOption;
    } else {
      choice = this.optionRepository.create({
        attempt_id: attempt.id,
        question_id: questionId,
        selected_option: selectedOption,
      });
    }
    const savedChoice = await this.optionRepository.save(choice);

    // 2. Save/Update the rough work in the 'rough_work_uploads' table
    let roughWork = await this.roughWorkRepository.findOne({
      where: { attempt_id: attempt.id, question_id: questionId },
    });

    if (roughWork) {
      roughWork.file_url = roughWorkUrl;
    } else {
      roughWork = this.roughWorkRepository.create({
        attempt_id: attempt.id,
        question_id: questionId,
        file_url: roughWorkUrl,
      });
    }
    const savedRoughWork = await this.roughWorkRepository.save(roughWork);

    return {
      choice: savedChoice,
      roughWork: savedRoughWork,
    };
  }

  async finishAttempt(studentId: number, examId: number): Promise<ExamAttempt> {
    const attempt = await this.attemptRepository.findOne({
      where: { student_id: studentId, exam_id: examId, finished_at: IsNull() },
    });
    if (!attempt) {
      throw new NotFoundException('No active exam attempt found to finish');
    }
    attempt.finished_at = new Date();
    return this.attemptRepository.save(attempt);
  }
}
