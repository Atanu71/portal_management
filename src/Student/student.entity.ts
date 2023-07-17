

import { CourseEntity } from 'src/course/course.entity';

import { CoursefEntity } from 'src/Student/coursef.entity';
import { FeedbackEntity } from 'src/feedback/feedback.entity';

import { Column, Entity,ManyToMany,OneToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity("Student")
export class StudentEntity{
@PrimaryGeneratedColumn()
id:number;
@Column({name:'fullname',type: "varchar",length: 150})
name:string;
@Column({type: "varchar",length: 150})
email:string;
@Column()
phone:number;
@Column()
password:string;
@Column({nullable:true})
filenames:string;

@OneToMany(() => CourseEntity, course => course.student)
courses:CourseEntity[];

//coursefeedback

@OneToMany(() => CoursefEntity, course => course.student)
coursesfeed: CoursefEntity[];

@OneToMany(() => FeedbackEntity, feedback => feedback.student)
feedbacks: FeedbackEntity[];

//profile
@OneToOne(() => StudentProfile, profile => profile.student)
profiles:StudentProfile[];

}

@Entity("Profile")
export class StudentProfile{
  @PrimaryGeneratedColumn()
  id:number;
  @Column({name:'fullname',type: "varchar",length: 150})
  name:string;
  @Column({type: "varchar",length: 150})
  email:string;
  @Column()
  phone:number;
  @Column()
  password:string;
  
  // @Column({nullable:true})
  // filenames:string;
  

@OneToOne(() =>StudentEntity, student =>student.profiles)
student:StudentEntity;


}

@Entity("StudentAdress")
export class StudentAdress{
@PrimaryGeneratedColumn()
id:number;
@Column()
name:string;
@Column({type: "varchar",length: 150})
photo:string;
}


@Entity("Notice")
export class NoticeEntity {
 
@PrimaryGeneratedColumn()
id:number;

  @Column({name:'notice name',type: "varchar",length: 100})
  title: string;

  @Column({name:'notice content',type: "varchar",length: 600})
  content: string;

}




