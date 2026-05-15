import { Controller, Post, Body, UseGuards, Req, Get, Param } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Exam } from './exam.entity';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createExam(
    @Req() req: any,
    @Body() examData: Partial<Exam>
  ) {
    // req.user is populated by JwtAuthGuard, typically containing the decoded token payload
    const instituteId = req.user.sub; // or req.user.id based on how JWT is configured
    
    return this.examsService.createExam(instituteId, examData);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getExams(@Req() req: any) {
    const instituteId = req.user.sub;
    return this.examsService.getExamsByInstitute(instituteId);
  }

  @Get(':link')
  async getExam(@Param('link') link: string) {
    return this.examsService.getExamByLink(link);
  }

  @Post(':id/keys')
  @UseGuards(JwtAuthGuard)
  async saveKeys(
    @Param('id') examId: string,
    @Body('keys') keys: any[]
  ) {
    return this.examsService.saveAnswerKeys(Number(examId), keys);
  }

  @Get(':id/keys')
  @UseGuards(JwtAuthGuard)
  async getKeys(@Param('id') examId: string) {
    return this.examsService.getAnswerKeys(Number(examId));
  }

  @Post(':id/key-paper')
  @UseGuards(JwtAuthGuard)
  async saveKeyPaper(
    @Param('id') examId: string,
    @Body('keys') keys: { question_number: number, correct_option: string }[]
  ) {
    return this.examsService.createKeyPaper(Number(examId), keys);
  }
}

