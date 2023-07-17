import { Injectable } from "@nestjs/common";
import {Scholarship, FinancialDetails ,notice,StudentLoginDTO, StudentDTO, StudentUpdateDTO, CourseStudentDto, Student, faculty, ProfileUpdateDTO} from "./student.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { StudentEntity } from "./student.entity";
import { Repository } from "typeorm";
import { CourseEntity } from "src/course/course.entity";
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import { NotFoundException } from "@nestjs/common";
import { NoticeEntity } from './student.entity';
import { CoursefEntity } from "./coursef.entity";
import { FeedbackEntity } from "src/feedback/feedback.entity";
import { StudentProfile } from "./student.entity";
import { MailerService } from '@nestjs-modules/mailer';
import * as nodemailer from 'nodemailer';



@Injectable()
export class StudentService{
    private criteria: string;
 
    constructor(
      
        @InjectRepository(StudentEntity)
        private studentRepo: Repository<StudentEntity>,

        private readonly mailerService: MailerService,
       
        @InjectRepository(CourseEntity)
        private courseRepo: Repository<CourseEntity>,
        @InjectRepository(NoticeEntity)
        private readonly noticeRepo: Repository<NoticeEntity>,
        @InjectRepository(CoursefEntity)
        private readonly coursefRepo: Repository<CoursefEntity>,
        @InjectRepository(FeedbackEntity)
        private readonly feedbackRepo: Repository<FeedbackEntity>,
        @InjectRepository(StudentProfile)
    private readonly studentProfileRepository: Repository<StudentProfile>,
   
    

   
    ) { }


    async sendEmail(subject: string, recipient: string, content: string): Promise<void> {
      try{

      
      await this.mailerService.sendMail({
        to: recipient,
        subject,
        text: content,
      });
      }
      catch(error){
        throw error;
      }
    }

    getScholarshipCriteria() {
        const filePath = "src/Student/criteria.json"; 
    
        try {
          const criteriaData = fs.readFileSync(filePath, 'utf8');
          const criteria = JSON.parse(criteriaData);
          return criteria;
        } catch (err) {
          console.error('Error reading criteria file:', err);
          return null;
        }
      }
    
      async updateFeedback(cfid: number, id: number, feedbackData: Partial<FeedbackEntity>): Promise<FeedbackEntity> {
        const courseFeedback = await this.coursefRepo.findOneBy({cfid});
        const student = await this.studentRepo.findOneBy({id});
        if (!courseFeedback) {
            throw new NotFoundException('Course feedback not found');
          }
        const feedback = new FeedbackEntity();
        feedback.comment = feedbackData.comment;
        feedback.rating = feedbackData.rating;
        feedback.courseFeedback = courseFeedback;
        feedback.student = student;
      
        const savedFeedback = await this.feedbackRepo.save(feedback);
 if (courseFeedback.feedbacks) {
    courseFeedback.feedbacks.push(savedFeedback);
  } else {
    courseFeedback.feedbacks = [savedFeedback];
  }
  await this.coursefRepo.save(courseFeedback);

  return savedFeedback;


      }
      





    async getIndex(): Promise<StudentEntity[]> {
        return this.studentRepo.find();
    }
    async getStudentById(id: number): Promise<StudentEntity> {
        return this.studentRepo.findOneBy({ id });
    }

    async getStudentbyIDAndName(id, name): Promise<StudentEntity> {
        return this.studentRepo.findOneBy({ id: id, name: name });
    }

    async addStudent(data: StudentDTO): Promise<StudentEntity> {
        return this.studentRepo.save(data);
    }

    async updateStudent(email:string, data: StudentUpdateDTO): Promise<StudentEntity> {
         await this.studentRepo.update(data.id, data);
        return this.studentRepo.findOneBy({ id: data.id });
    }
    async updateStudentById(id: number, data: StudentDTO): Promise<StudentEntity> {
        await this.studentRepo.update(id, data);
        return this.studentRepo.findOneBy({ id });
    }

   /*  async deleteUser(id: number): Promise<StudentEntity[]> {
        await this.studentRepo.delete(id);
        return this.studentRepo.find();
    }
*/
    //course
    async addCourse(course): Promise<CourseEntity> {
        return this.courseRepo.save(course);
    }

    async getAllCourses(): Promise<CourseEntity[]> {
        return this.courseRepo.find();
    }
    async getCoursesByStudent(studentid: number): Promise<StudentEntity[]> {
        return this.studentRepo.find({
            where: { id: studentid },
            relations: {
                courses: true,
            },
        });
    }

    async getCourseById(cid: number): Promise<CourseEntity> {
        return this.courseRepo.findOneBy({cid});
    }

    async deleteCourse(cid: number): Promise<string> {
        await this.courseRepo.delete(cid);
        return "Course deleted successfully";
      }
      
//updtecourse

async updateCourse(
    cid: number,
    updatedCourse: Partial<CourseEntity>
  ): Promise<CourseEntity> {
    await this.courseRepo.update({ cid }, updatedCourse);
    return this.courseRepo.findOneBy({ cid });
  }



  //studentprofile

  async createStudentWithProfile(studentData: Partial<StudentEntity>, profileData: Partial<StudentProfile>): Promise<StudentEntity> {
    const profile = this.studentProfileRepository.create(profileData);
    const student = this.studentRepo.create({
      ...studentData,
      profiles: [profile],
    });

    await this.studentProfileRepository.save(profile);
    return this.studentRepo.save(student);
  }


  async getProfileById(id: number): Promise<StudentProfile> {
    return this.studentProfileRepository.findOneBy({id});
}

async updateProfile(
    id: number,
    updatedProfile: Partial<StudentProfile>
  ): Promise<StudentProfile> {
    await this.studentProfileRepository.update({ id }, updatedProfile);
    return this.studentProfileRepository.findOneBy({ id });
  }


 

      
//signup
    async signup(data: StudentDTO): Promise<StudentEntity> {
        const salt = await bcrypt.genSalt();
        console.log(data);
        data.password = await bcrypt.hash(data.password,salt);
        
       return this.studentRepo.save(data);
    }


    //login
// async signIn(data:StudentLoginDTO) {
//     const userdata= await this.studentRepo.findOneBy({email:data.email});
// const match:boolean = await bcrypt.compare(data.password, userdata.password);
// return match;

// }
async signIn(data: StudentLoginDTO) {

  const userdata = await this.studentRepo.findOneBy({ email: data.email });
  if (!userdata) {

    return false;

  }




  const match = await bcrypt.compare(data.password, userdata.password);

  return match;

}

   async getimagebystudentid(studentid:number) {
const mydata:StudentDTO =await this.studentRepo.findOneBy({ id:studentid});
console.log(mydata);
return  mydata.filenames;
    }
getCourse(id):Promise<StudentEntity[]>
{
    return this.studentRepo.find({
        where:{id:id},
        relations: {
            courses: true,
        },
    });
} 

  //notice
 async getNoticeById(id: number): Promise<NoticeEntity> {
   return this.noticeRepo.findOneBy({id});
 }



}


