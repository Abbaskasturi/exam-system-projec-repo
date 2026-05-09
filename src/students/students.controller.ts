import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { StudentsService } from './students.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Student } from './student.entity';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createStudent(
    @Req() req: any,
    @Body() studentData: Partial<Student>
  ) {
    const instituteId = req.user.sub;
    return this.studentsService.createStudent(instituteId, studentData);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getStudents(@Req() req: any) {
    const instituteId = req.user.sub;
    return this.studentsService.getStudentsByInstitute(instituteId);
  }
}
