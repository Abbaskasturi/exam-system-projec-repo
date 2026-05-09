import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Institute } from './institute.entity';
import { CreateInstituteDto } from './dto/create-institute.dto';
import { LoginInstituteDto } from './dto/login-institute.dto';

@Injectable()
export class InstitutesService {
  constructor(
    @InjectRepository(Institute)
    private instituteRepository: Repository<Institute>,
    private jwtService: JwtService,
  ) { }

  async register(createInstituteDto: CreateInstituteDto): Promise<any> {
    const { name, email, subdomain } = createInstituteDto;

    // Check if institute already exists
    const existingInstitute = await this.instituteRepository.findOne({ where: { email } });
    if (existingInstitute) {
      throw new ConflictException('Institute with this email already exists');
    }

    // Create and save new institute
    const newInstitute = this.instituteRepository.create({
      name,
      email,
      subdomain,
    });

    const savedInstitute = await this.instituteRepository.save(newInstitute);

    return {
      message: 'Registration successful',
      id: savedInstitute.id,
    };
  }

  async login(loginInstituteDto: LoginInstituteDto): Promise<any> {
    const { email } = loginInstituteDto;

    // Find institute by email
    const institute = await this.instituteRepository.findOne({ where: { email } });

    if (!institute) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { email: institute.email, sub: institute.id };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      collegeName: institute.name,
    };
  }
}
