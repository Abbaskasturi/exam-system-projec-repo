import { Controller, Post, UseGuards, UseInterceptors, UploadedFile, Req, Body, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { QuestionsService } from './questions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

const uploadDir = './uploads/questions';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: uploadDir,
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new BadRequestException('Only PDF files are allowed!'), false);
      }
    }
  }))
  async uploadQuestion(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
    @Body('difficulty_level') difficultyLevel: string
  ) {
    if (!file) {
      throw new BadRequestException('PDF file is required');
    }
    if (!difficultyLevel) {
      throw new BadRequestException('Difficulty level is required');
    }

    // req.user is set by the JwtAuthGuard
    // The sub property contains the institute ID
    const instituteId = req.user.sub;
    const imageUrl = file.path;

    return this.questionsService.createQuestion(instituteId, imageUrl, difficultyLevel);
  }
}
