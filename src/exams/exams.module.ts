import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';
import { Exam } from './exam.entity';
import { AnswerKey } from './entities/answer-key.entity';
import { KeyPaper } from './entities/key-paper.entity';
import { InstitutesModule } from '../institutes/institutes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exam, AnswerKey, KeyPaper]),
    InstitutesModule,
  ],
  controllers: [ExamsController],
  providers: [ExamsService]
})
export class ExamsModule {}
