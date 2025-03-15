import { Component } from '@angular/core';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  email: string = '';
  password: string = '';

  onSubmit() {
    console.log('User Logged In:', {
      email: this.email,
      password: this.password
    });
    // Тут можна додати логіку для авторизації через сервер
  }
}
