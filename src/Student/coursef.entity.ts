import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { StudentEntity } from './student.entity';
import { FeedbackEntity } from 'src/feedback/feedback.entity';
@Entity('CourseFeedback')
export class CoursefEntity {
  @PrimaryGeneratedColumn()
  cfid: number;

  @Column()
  name: string;

  // ...

  @OneToMany(() => FeedbackEntity, feedback => feedback.courseFeedback)
  feedbacks: FeedbackEntity[];

  @ManyToOne(() => StudentEntity, student => student.coursesfeed)
  student: StudentEntity;
}
