import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { Test } from '../../interfaces/test.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-quizzes',

  templateUrl: './quizzes.component.html',
  styleUrl: './quizzes.component.scss'
})
export class QuizzesComponent implements OnInit {
  tests: Test[];
  userId: string;

  constructor(private quizService: QuizService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId') || 'defaultUserId';

    this.quizService.getTestsByUser(this.userId).subscribe(response => {
      this.tests = response;
    });
  }
}
