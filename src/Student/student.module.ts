import { Module } from "@nestjs/common";
import { StudentController } from "./student.controller";
import { StudentService } from "./student.service";
import { StudentEntity, StudentAdress, StudentProfile, NoticeEntity } from "./student.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CourseEntity } from "../course/course.entity";
import { CoursefEntity } from "./coursef.entity";
import { FeedbackEntity } from "src/feedback/feedback.entity";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
    imports: [
      
      
      MailerModule.forRoot({
        transport: {
          host: 'your-smtp-host',
          port: 587,
          secure: false,
          auth: {
            user: 'your-email-username',
            pass: 'your-email-password',
          },
        },
        defaults: {
          from: 'your-email-address',
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(), // You can use other template engines as well
          options: {
            strict: true,
          },
        },
      }),
    
      
      TypeOrmModule.forFeature([StudentEntity, StudentAdress, StudentProfile, NoticeEntity, CourseEntity, CoursefEntity,FeedbackEntity]),],
    controllers: [StudentController],
    providers: [StudentService],
  })
  export class StudentModule {}
