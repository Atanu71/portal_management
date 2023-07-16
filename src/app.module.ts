import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { StudentModule } from './Student/student.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'Gmail',
        auth: {
          user: 'dasatanu348@gmail.com',
          pass: 'hcxingfdplixepgs',
        },
      },
      defaults: {
        from: '"atanu" <dasatanu348@gmail.com>',
      },
      // template: {
      //   dir: __dirname + './Student/templates',
        // adapter: new HandlebarsAdapter(),
      //   options: {
      //     strict: true,
      //   },
      // },
    }),


    StudentModule, TypeOrmModule.forRoot(
    { type: 'postgres',
     host: 'localhost',
     port: 5432,
     username: 'postgres',
     password: 'postgree',
     database: '3np_beckend',
     autoLoadEntities: true,
     synchronize: true,
     } ),
    ],
  controllers: [],
  providers: [],
})
export class AppModule {}
