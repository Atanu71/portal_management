import {IsNumber,IsEmail,isNotEmpty, IsEmpty, IsNotEmpty, IsString, Matches} from'class-validator';



export class StudentDTO{
   @IsString({message:"invalid name"})
   @Matches( /^[a-zA-Z]+$/, {message:"enter a proper name"})
    name: string;

  @IsEmail({}, {message:"invalid email"})
    email: string;
    password: string;
    phone: number;
    filenames: string;
   

  }
    
  export class StudentLoginDTO {
  @IsEmail({}, { message: "invalid email" })
   email: string;
   password: string;
}


  export class CourseStudentDto {
   readonly name: string;
    readonly courseIds: number[]; // Change the property name to courseIds and make it an array
  }

  export class StudentUpdateDTO{
  
    id:number;
    @IsNotEmpty()
    name: string;
    @IsEmail()
     email: string;
     password: string;
 }

  export class profileDTO{
    @IsNumber()
    @IsNotEmpty()
    id:number;
    @IsString({message:"Please enter proper name."})
    name: string;

    @IsEmail({},{message:"Please enter proper email."})
    email: string;
    

}

export class ProfileUpdateDTO{

  @IsNumber()

  @IsNotEmpty()

  id:number;

  @IsString({message:"Please enter proper name."})
 
  name: string;

  @IsEmail({},{message:"Please enter proper email."})

  email: string;
}









export class notice{

  title: string;
  content: string;
  date: string;
}

export class Scholarship {
 
  title: string;
  eligibility: string;
  opportunity: string;
}

export interface faculty {
  id: number;
  name: string;
  designation:string;
  contact:number;
  background:string;
}


 export interface Student {
 
    id: number;

    
    name: string;
    financialDetails: FinancialDetails;
   // Add the notices property
  }

  export interface FinancialDetails {
    tuitionFee: number;
    scholarshipAmount: number;
    totalPayment: number;
  }

