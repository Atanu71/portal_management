import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CourseFeedbackDto {
  @IsNotEmpty()
  @IsNumber()
  courseId: number;

  @IsNotEmpty()
  @IsString()
  feedback: string;
}

export class InstructorFeedbackDto {
  @IsNotEmpty()
  @IsNumber()
  instructorId: number;

  @IsNotEmpty()
  @IsString()
  feedback: string;
}
