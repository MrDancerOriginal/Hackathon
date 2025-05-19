import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environments';

declare const gapi: any; // Temporary declaration until types are properly loaded

@Injectable({
  providedIn: 'root'
})
export class GoogleFormService {
  private readonly API_URL = 'https://forms.googleapis.com/v1/forms';
  private readonly SCOPES = 'https://www.googleapis.com/auth/forms.body';
  private readonly DISCOVERY_DOC = 'https://forms.googleapis.com/$discovery/rest?version=v1';

  constructor(private http: HttpClient) {
    this.loadGapi();
  }

  private loadGapi(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google API'));
      document.body.appendChild(script);
    });
  }

  initializeGapi(): Promise<void> {
    return gapi.load('client:auth2', () => {
      return gapi.client.init({
        apiKey: 'YOUR_API_KEY',
        clientId: environment.clientId,
        discoveryDocs: [this.DISCOVERY_DOC],
        scope: this.SCOPES
      });
    });
  }

  authenticateUser(): Observable<any> {
    return from(this.loadGapi()).pipe(
      switchMap(() => from(this.initializeGapi())),
      switchMap(() => {
        const authInstance = gapi.auth2.getAuthInstance();
        return from(authInstance.signIn());
      }),
      switchMap(() => {
        const authResponse = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse();
        return authResponse.access_token;
      })
    );
  }

  createGoogleForm(token: string, title: string, questions: any[]): Observable<any> {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const formStructure = {
      info: {
        title: title,
        documentTitle: title
      },
      items: this.mapQuestionsToFormItems(questions)
    };

    return this.http.post(this.API_URL, formStructure, { headers });
  }

  private mapQuestionsToFormItems(questions: any[]): any[] {
    return questions.map(question => ({
      title: question.questionText,
      questionItem: {
        question: {
          required: true,
          choiceQuestion: {
            type: 'RADIO',
            options: question.answers.map((answer : any) => ({
              value: answer.answerText
            })),
            shuffle: true
          }
        }
      }
    }));
  }
}
