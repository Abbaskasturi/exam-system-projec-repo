import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { Question } from './question.entity';
import { InstitutesModule } from '../institutes/institutes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question]),
    InstitutesModule, // This imports the JwtModule that we exported earlier
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
