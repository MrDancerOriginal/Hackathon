import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class TestingService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getRequest() {
    return this.http.get<any>(this.baseUrl)
  }

  postRequest() {
    return this.http.post<any>(this.baseUrl, "")
  }
}
