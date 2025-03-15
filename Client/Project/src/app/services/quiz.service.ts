import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../interfaces/user.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  baseUrl = environment.apiUrl;

  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  uploadFile(data: any): Observable<number> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('questionCount', data.questionCount.toString());
    formData.append('answerCount', data.answerCount.toString());
    formData.append('file', data.file, data.file.name);

    return this.http.post<number>(this.baseUrl + 'Tests/upload', formData);
  }

  getTestsByUser(userId : string){
    return this.http.get<any>(`${this.baseUrl}/user/${userId}`);
  }

  generateTest(pdfFileId: number): Observable<any> {
    const requestPayload = {
      PDFFileId: pdfFileId
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${this.baseUrl}/generate`, requestPayload, { headers });
  }

}
