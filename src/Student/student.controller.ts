import { Body, Controller,Delete, Patch, Get, Param, Post, Put, Query, Request, Res, UploadedFile, UseInterceptors,NotFoundException, UsePipes, ValidationPipe, Session, UseGuards,HttpException, HttpStatus } from "@nestjs/common";
import { StudentService } from "./student.service";
import { CourseStudentDto, ProfileUpdateDTO, Scholarship, StudentDTO, StudentUpdateDTO, profileDTO } from "./student.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { MulterError, diskStorage } from "multer";
import { CourseFeedbackDto, InstructorFeedbackDto } from './feedback.dto';
import { ParseIntPipe } from '@nestjs/common';
import { Student } from './student.interface';
import { notice, FinancialDetails } from "./student.dto";
import { FeedbackEntity } from "src/feedback/feedback.entity";
import { CoursefEntity } from "./coursef.entity";
import { CourseEntity } from "src/course/course.entity";
import { StudentEntity, StudentProfile } from "./student.entity";
import session = require("express-session");
import { SessionGuard } from "./session.gaurd";


@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService
    ) {}

  // ... Other methods ...

  /* @Get()
  getAllStudents(): Student[] {
    return this.studentService.getAllStudents();
  } */
  @Get('/search/:id')
  async getStudentById(@Param('id', ParseIntPipe) id: number): Promise<object> {
    try {
      const student = await this.studentService.getStudentById(id);

      if (!student) {
        throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }

      return { message: 'Student found', student };
    } catch (error) {
      throw new HttpException(error.message, error.getStatus());
    }
  }

 



  /* @Get('/search')
  searchStudents(@Query('name') name: string): Student[] {
    if (name) {
      return this.studentService.findStudentsByName(name);
    } else {
      return [];
    }
  }
*/
@Get('/search')
    getStudentbyIDAndName(@Query() qry: any): object {

        return this.studentService. getStudentbyIDAndName(qry.id, qry.name);
    }


  /* @Put('/updateStudent/:id')

  @UsePipes(new ValidationPipe())
  
  studentprofile(@Param() id:number,@Body() data:ProfileUpdateDTO): object{
  
      return this.studentService.studentprofile(id,data);
  
  } */

  @Put('/updatestudent')
  //@UsePipes(new ValidationPipe())
  @UseGuards(SessionGuard)
  updateStudent( @Body() data: StudentUpdateDTO,  @Session() session): object {

    if (!session.email) {
      return { message: 'Please Login First' };
    }
    console.log(session.email);
    return this.studentService.updateStudent(session.email, data );
  }


  @Put('/updatestudent/:id')
  //@UsePipes(new ValidationPipe())

  @UseGuards(SessionGuard)

  updateStudentbyID(@Param("id") id: number, @Body() data: StudentDTO): object {
      return this.studentService.updateStudentById(id, data);
  }






  
/*
  @Get('/notice')
  getNotice(): notice[] {
  return this.studentService.getNotices();
  }

//scholership
@Get('/scholarship-eligibility')
getScholarshipEligibility(): Scholarship[]{
  return this.studentService.getScholarshipEligibility();
}
  

  @Patch(':studentId/courses/:courseId/feedback')
  updateCourseFeedback(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() feedbackDto: CourseFeedbackDto,
  ): string {
    const { feedback } = feedbackDto;
    return this.studentService.updateCourseFeedback(studentId, courseId, feedback);
  }
  
  @Patch(':studentId/instructors/:instructorId/feedback')
  updateInstructorFeedback(
    @Param('studentId', new ParseIntPipe()) studentId: number,
    @Param('instructorId', new ParseIntPipe()) instructorId: number,
    @Body() feedbackDto: InstructorFeedbackDto,
  ): string {
    const { feedback } = feedbackDto;
    return this.studentService.updateInstructorFeedback(studentId, instructorId, feedback);
  }


//financial
@Get(':id/financial-details')
  getFinancialDetails(@Param('id', ParseIntPipe) id: number): FinancialDetails | null {
    return this.studentService.getFinancialDetailsById(id);
  }


@Post('/addstudent')
    @UsePipes(new ValidationPipe())
    addstudent(@Body() data: studentDTO): object {
        return this.studentService.addstudent(data);
    }


  @Post('/addcourses')
  @UsePipes(new ValidationPipe())
  addCourse(@Body() courseStudentDto: CourseStudentDto) {
    return this.studentService.addCoursesToStudent(courseStudentDto);
  }
*/




  @Post('/uploadassignment')
  @UseInterceptors(
    FileInterceptor('myfile', {
      

      fileFilter: (req, file, cb) => {
        if (
          file.originalname.match(/^.*\.(jpg|webp|png|jpeg|docx|pdf|ppt|pptx)$/)
        ) {
          cb(null, true);
        } else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'Invalid file format'), false);
        }
      },
      

      limits: { fileSize: 2 * 1024 * 1024 },
      storage: diskStorage({
        destination: './uploads',
        filename: function (req, file, cb) {
          cb(null, Date.now() + file.originalname);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() myfileobj: Express.Multer.File): object {
    console.log(myfileobj);
    return { message: "file uploaded" };
  }

  @Get('/getfile/:filename')
  getFiles(@Param('filename') name, @Res() res) {
    res.sendFile(name, { root: './uploads' });
  }



 @Post('/addcourse')
 @UseGuards(SessionGuard)
    addcourses(@Body() course) {
        console.log(course);
        return this.studentService.addCourse(course);
    }

// @Get('/getcourse/:studentid')

//     getcourses(@Param('studentid', ParseIntPipe) studentid:number) {
       
//         return this.studentService.getCourse(studentid);
//     }

@Get('/getcourse/:studentid')
  async getcourses(@Param('studentid', ParseIntPipe) studentid: number): Promise<object> {
    try {
      const student = await this.studentService.getStudentById(studentid);

      if (!student) {
        throw new HttpException('Student does not exist', HttpStatus.NOT_FOUND);
      }

      const courses = await this.studentService.getCourse(studentid);
      return { message: 'Student found', courses };
    } catch (error) {
      throw new HttpException(error.message, error.getStatus());
    }
  }

// @Get('/search/course/:id')
//     getCourseById(@Param('id', ParseIntPipe) id: number): object {
//       return this.studentService.getCourseById(id);
//   }

@Get('/search/course/:id')
  async getCourseById(@Param('id', ParseIntPipe) id: number): Promise<object> {
    try {
      const course = await this.studentService.getCourseById(id);

      if (!course) {
        throw new NotFoundException('Course does not exist');
      }

      return { message: 'Course found', course };
    } catch (error) {
      throw error;
    }
  }
 
  @Delete('/course/:id')
  async deleteCourse(@Param('id', ParseIntPipe) id: number): Promise<object> {
    const message = await this.studentService.deleteCourse(id);
    return { message };
  }
  

  

  @Put('/course/:id')
async updateCourse(
  @Param('id', ParseIntPipe) id: number,
  @Body() course: Partial<CourseEntity>
): Promise<object> {
  const updatedCourse = await this.studentService.updateCourse(id, course);
  return { message: 'Course updated successfully', course: updatedCourse };
}



@Post('/signup')
@UseInterceptors(FileInterceptor('image',
        {
            fileFilter: (req, file, cb) => {
                if ( file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
                    cb(null, true);
                else {
                    cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
                }
            },
            limits: { fileSize: 10*1024*1024},
            storage: diskStorage({
                destination: './uploads',
                filename: function (req, file, cb) {
                    cb(null, Date.now() + file.originalname)
                },
            })
        }
    ))
    @UsePipes(new ValidationPipe)
signup(@Body() mydata:StudentDTO,@UploadedFile() imageobj: Express.Multer.File){
console.log(mydata);
console.log(imageobj.filename);
mydata.filenames = imageobj.filename;
return this.studentService.signup(mydata);

}

@Post('/signin')
signIn(@Body() data:StudentDTO, @Session() session){

  if (this.studentService.signIn(data)) {
    session.email = data.email;
    // return true;
    return { message: 'Login successful' };
}
else {

    return false;
}
  
}


//session
// @Post('login')
// async login(@Body() credentials: { email: string, password: string }, @Session() session): Promise<object> {
//   // Perform login logic, e.g., check credentials, validate user, etc.
//   // If successful, set session data
//   session.email = credentials.email;
//   return { message: 'Login successful' };
// }

// @Get('profile')
// @UseGuards(SessionGuard)
// async getProfile(@Session() session): Promise<object> {
//   // Access session data and retrieve student profile
//   const profile = await this.studentService.getProfileByEmail(session.email);
//   return { profile };
// }

// @Put('update')
// @UseGuards(SessionGuard)
// async updateProfile(@Body() data: StudentUpdateDTO, @Session() session): Promise<object> {
//   // Access session data and update student profile
//   const updatedProfile = await this.studentService.updateProfileByEmail(session.email, data);
//   return { message: 'Profile updated successfully', profile: updatedProfile };
// }

@Post('logout')
async logout(@Session() session): Promise<object> {
  
  session.destroy();
  return { message: 'Logout successful' };
}





@Get('getimagebystudentid/:studentId')
async getimagebyid(@Param('studentId', ParseIntPipe) studentId:number, @Res() res){
    const filename = await this.studentService.getimagebystudentid(studentId);
    res.sendFile(filename, { root: './uploads' })

}


@Get('notice/:id')
async getNoticeById(@Param('id') id: number) {
  return this.studentService.getNoticeById(id);
}



@Get('scholarship')
  getScholarshipCriteria() {
    return this.studentService.getScholarshipCriteria();
  }


  @Post(':studentId/courses/:courseId/feedback')
  async updateFeedback(
    @Param('studentId') id: number,
    @Param('courseId') cfid: number,
    @Body() feedbackData: Partial<FeedbackEntity>,
  ) {
    return this.studentService.updateFeedback(id,cfid, feedbackData);
  }
  

//profile



// @Get('getprofile/:studentid')
// getprofiles(@Param('studentid', ParseIntPipe) studentid:number){

//   return this.studentService,this.getprofiles(studentid);
// }


// @Put('/profile/:id')
// async updateProfile(
// @Param('id', ParseIntPipe) id: number,
// @Body() profile: Partial<StudentProfile>
// ): Promise<object> {
// const updatedprofile = await this.studentService.updateProfile(id, profile);
// return { message: 'profile updated successfully', profile:updatedprofile };
// }

@Post()
  async createStudent(@Body() studentData: Partial<StudentEntity>, @Body() profileData: Partial<StudentProfile>): Promise<StudentEntity> {
    return this.studentService.createStudentWithProfile(studentData, profileData);
  }

  @Get('profile/:id')
  async getProfileById(@Param('id') id: number): Promise<StudentProfile> {
    return this.studentService.getProfileById(id);
  }

  @Put('profile/:id')
  async updateProfile(@Param('id') id: number, @Body() profile: Partial<StudentProfile>): Promise<object> {
    const updatedProfile = await this.studentService.updateProfile(id, profile);
    return { message: 'Profile updated successfully', profile: updatedProfile };
  }





//mailer

  @Post('/send-email')
  async sendEmail(@Body() emailData: { subject: string; recipient: string; content: string }): Promise<void> {
    const { subject, recipient, content } = emailData;
    await this.studentService.sendEmail(subject, recipient, content);
  }

















}
