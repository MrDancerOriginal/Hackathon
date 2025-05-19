import { Component, OnInit } from '@angular/core';
import { AccountService } from './services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'Project';
  userId : string;
  constructor(public accountService:AccountService){}

  ngOnInit(): void {
    this.accountService.currentUser$.subscribe(user => {
      this.userId = user.id;
    })
  }


  logout(){
    this.accountService.logout();
  }
}
