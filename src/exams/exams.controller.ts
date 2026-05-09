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

  @Get(':link')
  async getExam(@Param('link') link: string) {
    return this.examsService.getExamByLink(link);
  }
}

