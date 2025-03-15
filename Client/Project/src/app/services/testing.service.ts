import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestingService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getRequest(): Observable<any> {
    return this.http.get<any>(this.baseUrl + "Test/cat")
  }

  postRequest() {
    return this.http.post<any>(this.baseUrl, "")
  }
}
