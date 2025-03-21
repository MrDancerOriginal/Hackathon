import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../interfaces/user.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { Question } from '../interfaces/question.interface';
import { TestStatus } from '../enums/test-status.enum';

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
    return this.http.get<any>(`${this.baseUrl}/user/${userId}`);
  }

  generateTest(pdfFileId: number = 1): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    console.log("Start");

    return this.http.post<any>(`${this.baseUrl}Test/generate/${pdfFileId}`, pdfFileId, { headers });
  }

  createTest(title: string, userId: number): Observable<any> {
    const testData = {
      title: title,
      description: '',
      authorId: userId,
      status: TestStatus.Published
    };

    return this.http.post(this.baseUrl + 'Test/create', testData);
  }

}
