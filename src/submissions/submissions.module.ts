import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmissionsController } from './submissions.controller';
import { SubmissionsService } from './submissions.service';
import { ExamAttempt } from './entities/exam-attempt.entity';
import { RoughWork } from './entities/submission.entity';
import { Option } from '../questions/option.entity';
import { InstitutesModule } from '../institutes/institutes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExamAttempt, RoughWork, Option]),
    InstitutesModule,
  ],
  controllers: [SubmissionsController],
  providers: [SubmissionsService],
})
export class SubmissionsModule {}
