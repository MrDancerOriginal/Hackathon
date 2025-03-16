import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user.interface';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;

  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  login(model: any) {
    console.log(model)
    return this.http.post<User>(this.baseUrl + 'Authentication/Login', model).pipe(
      map((response: User) => {
        const user = response;
        console.log(user)
        if (user) {
          this.setCurrentUser(user);
        }
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

    return this.http.post<User>(this.baseUrl + 'Authentication/Register', sendBody).pipe(
      map(user => {
        console.log(user)
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  setCurrentUser(user: User) {
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


