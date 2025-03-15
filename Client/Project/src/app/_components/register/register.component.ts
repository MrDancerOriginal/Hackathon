import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';

  onSubmit() {
    console.log('User Registered:', {
      username: this.username,
      email: this.email,
      password: this.password
    });
    // Тут можна додати логіку для відправки даних на сервер
  }
}
