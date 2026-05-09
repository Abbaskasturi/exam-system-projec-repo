import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { Student } from './student.entity';
import { InstitutesModule } from '../institutes/institutes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student]),
    InstitutesModule,
  ],
  controllers: [StudentsController],
  providers: [StudentsService]
})
export class StudentsModule {}
