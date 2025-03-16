import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { Test } from '../../interfaces/test.interface';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-quizzes',
  templateUrl: './quizzes.component.html',
  styleUrl: './quizzes.component.scss'
})
export class QuizzesComponent implements OnInit {
  tests: Test[];
  userId: string;

  constructor(private quizService: QuizService, private route: ActivatedRoute,private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.currentUser$.subscribe(user => {
      this.userId = user.id.toString();
      this.quizService.getTestsByUser(this.userId).subscribe(response => {
        this.tests = response;
      });
    })


  }
}
