
import { StudentEntity } from    'src/Student/student.entity';
import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity("Course")
export class CourseEntity{
@PrimaryGeneratedColumn()
cid:number;
@Column({name:'cname',type: "varchar",length: 50})
cname:string;
@Column({name:'time',type: "varchar",length: 50})
time:string;



@ManyToOne(() => StudentEntity, student => student.coursesfeed)
student: StudentEntity;

}