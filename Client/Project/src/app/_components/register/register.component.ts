import { Component } from '@angular/core';
import { AppModule } from '../../app.module';

@Component({
  selector: 'app-register',
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
