import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

declare const gapi: any; // Декларація gapi як any

@Injectable({
  providedIn: 'root'
})
export class GoogleFormService {
  private CLIENT_ID = environment.clientId;
  private SCOPES = 'https://www.googleapis.com/auth/forms.body';

  constructor() {
    this.loadGapi();
  }

  private loadGapi() {
    gapi.load('client:auth2', () => {
      gapi.client.init({
        clientId: this.CLIENT_ID,
        scope: this.SCOPES
      });
    });
  }

  public async authenticate() {
    try {
      await gapi.auth2.getAuthInstance().signIn();
      console.log('User  signed in');
    } catch (error) {
      console.error('Error signing in', error);
    }
  }

  public async createGoogleForm() {
    await this.authenticate();

    const formBody = {
      info: {
        title: 'Angular Test',
        documentTitle: 'Angular Quiz'
      }
    };

    const response = await gapi.client.forms.forms.create({
      resource: formBody
    });

    const formId = response.result.formId;

    const update = {
      requests: [
        {
          createItem: {
            item: {
              title: 'Що виведе print(2 ** 3)?',
              questionItem: {
                question: {
                  required: true,
                  choiceQuestion: {
                    type: 'RADIO',
                    options: [
                      { value: '6' },
                      { value: '8' },
                      { value: '9' }
                    ],
                    shuffle: true
                  }
                }
              }
            },
            location: { index: 0 }
          }
        }
      ]
    };

    await gapi.client.forms.forms.batchUpdate({
      formId: formId,
      resource: update
    });

    console.log(`Google Form created: https://docs.google.com/forms/d/${formId}/edit`);
  }
}
