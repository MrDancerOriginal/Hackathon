import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../interfaces/user.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { Question } from '../interfaces/question.interface';
import { TestStatus } from '../enums/test-status.enum';
import { TestSummaryDto } from '../interfaces/test-summary-dto';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  baseUrl = environment.apiUrl;

  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  uploadFile(data: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', data);

    // const formData = new FormData();
    // formData.append('title', data.title);
    // formData.append('questionCount', data.questionCount.toString());
    // formData.append('answerCount', data.answerCount.toString());
    // formData.append('file', data.file, data.file.name);

    return this.http.post<number>(this.baseUrl + 'Test/upload', formData, {
      headers: {
        // При передачі FormData не встановлюйте `Content-Type`, браузер виставить його автоматично
      }
    });
  }

  getTestsByUser(userId : string){
    console.log("hello")
    return this.http.get<TestSummaryDto[]>(`${this.baseUrl}Test/user/${userId}`);
  }

  generateTestDemo(pdfFileId: number = 1): Question[]{
    return [
      {
        questionText: "У якому році був заснований Національний Авіаційний Університет?",
        answers: [
          { answerText: "1925", isCorrect: false },
          { answerText: "1933", isCorrect: true },
          { answerText: "1947", isCorrect: false },
          { answerText: "1955", isCorrect: false }
        ]
      }
    ];



  }

  generateTest(pdfFileId: number = 1): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    console.log("Start");

    return this.http.post<any>(`${this.baseUrl}Test/generate/${pdfFileId}`, pdfFileId, { headers });
  }

  createTest(title: string, userId: string, pdffileId: number, questions: any[], description: string, questionCount: number, answerOptions: number ) :any {



    const testData = {
      authorId: userId,
      title: title,
      description: description,
      status: "Published",
      questions : questions,
      PDFFileId : pdffileId
    };

    return this.http.post(this.baseUrl + 'Test/create', testData);
  }


}
