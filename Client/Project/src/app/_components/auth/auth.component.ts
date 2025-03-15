import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth',
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
