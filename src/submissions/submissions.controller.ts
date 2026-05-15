import { Controller, Post, Body, UseGuards, Req, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

const uploadDir = './uploads/rough_work';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post('start')
  @UseGuards(JwtAuthGuard)
  async startAttempt(@Req() req: any, @Body('exam_id') examId: number) {
    const studentId = req.user.sub;
    return this.submissionsService.startAttempt(studentId, examId);
  }

  @Post('submit')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: uploadDir,
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  async submitAnswer(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
    @Body('exam_id') examId: string,
    @Body('question_id') questionId: string,
    @Body('selected_option') selectedOption: string,
  ) {
    if (!file) {
      throw new BadRequestException('Rough work submission is mandatory');
    }
    if (!examId || !questionId || !selectedOption) {
      throw new BadRequestException('Missing required fields');
    }

    const studentId = req.user.sub;
    const roughWorkUrl = file.path.replace(/\\/g, '/');
    
    return this.submissionsService.submitAnswer(
      studentId,
      Number(examId),
      Number(questionId),
      selectedOption,
      roughWorkUrl
    );
  }

  @Post('finish')
  @UseGuards(JwtAuthGuard)
  async finishAttempt(@Req() req: any, @Body('exam_id') examId: number) {
    const studentId = req.user.sub;
    return this.submissionsService.finishAttempt(studentId, examId);
  }
}
