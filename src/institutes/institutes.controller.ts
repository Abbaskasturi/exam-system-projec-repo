import { Controller, Post, Body } from '@nestjs/common';
import { InstitutesService } from './institutes.service';
import { CreateInstituteDto } from './dto/create-institute.dto';
import { LoginInstituteDto } from './dto/login-institute.dto';

@Controller('institutes')
export class InstitutesController {
  constructor(private readonly institutesService: InstitutesService) {}

  @Post('register')
  async register(@Body() createInstituteDto: CreateInstituteDto) {
    return this.institutesService.register(createInstituteDto);
  }

  @Post('login')
  async login(@Body() loginInstituteDto: LoginInstituteDto) {
    return this.institutesService.login(loginInstituteDto);
  }
}
