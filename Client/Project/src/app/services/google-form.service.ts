import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

declare const gapi: any; // Декларація gapi як any

@Injectable({
  providedIn: 'root'
})
export class GoogleFormService {
  private clientId = environment.clientId;
  private scope = 'https://www.googleapis.com/auth/forms.body';

  constructor(private http: HttpClient) {}

  async authenticateUser() {
    return new Promise((resolve, reject) => {
      gapi.load('client:auth2', async () => {
        await gapi.client.init({
          clientId: this.clientId,
          scope: this.scope
        });

        const authInstance = gapi.auth2.getAuthInstance();
        authInstance.signIn().then(() => {
          const token = authInstance.currentUser.get().getAuthResponse().access_token;
          resolve(token);
        }).catch(reject);
      });
    });
  }

  createGoogleForm(accessToken: string) {
    const url = 'https://forms.googleapis.com/v1/forms';
    const formData = {
      info: { title: 'Нова форма' },
      items: [{
        title: 'Ваше питання?',
        questionItem: { question: { required: true } }
      }]
    };

    return this.http.post(url, formData, {
      headers: { Authorization: `Bearer ${accessToken}` }
    }).toPromise();
  }
}
