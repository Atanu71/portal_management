import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CoursefEntity } from 'src/Student/coursef.entity';
import { StudentEntity } from  'src/Student/student.entity';

@Entity('Feedback')
export class FeedbackEntity {
  @PrimaryGeneratedColumn()
  fid: number;

  @Column()
  comment: string;

  @Column()
  rating: number;

  @ManyToOne(() => CoursefEntity,coursef => coursef.feedbacks)
  courseFeedback: CoursefEntity;

  @ManyToOne(() => StudentEntity, student => student.feedbacks)
  student: StudentEntity;
}
