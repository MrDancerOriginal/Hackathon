import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { User as number } from '../interfaces/user.interface';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { WorkUser } from '../interfaces/work-user.interface';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;

  private currentUserSource = new BehaviorSubject<WorkUser | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  login(model: any) : Observable<string>{

    return this.http.post<string>(this.baseUrl + 'Authentication/Login', model).pipe(
      map((response: any) => {
        console.log(response.id)
        const user = response;
        if (user) {
          this.setCurrentUser(user);
        }
        return response.id;
      })
    );
  }

  register(model: any) {
    console.log(model)

    const sendBody = {
      Name : model.username,
      Email: model.email,
      Password: model.password
    };

    return this.http.post<any>(this.baseUrl + 'Authentication/Register', sendBody).pipe(
      map(user => {
        console.log(user)
        const myuser = {
          id: user.id,
          token: user.token
        }

        if (user) {
          this.setCurrentUser(myuser);
        }
      })
    );
  }

  setCurrentUser(user: WorkUser) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }
}


