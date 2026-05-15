import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InstitutesModule } from './institutes/institutes.module';
import { QuestionsModule } from './questions/questions.module';
import { ExamsModule } from './exams/exams.module';
import { StudentsModule } from './students/students.module';
import { SubmissionsModule } from './submissions/submissions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false, // Auto-create tables (turn off in production!)
      }),
      inject: [ConfigService],
    }),
    InstitutesModule,
    QuestionsModule,
    ExamsModule,
    StudentsModule,
    SubmissionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
