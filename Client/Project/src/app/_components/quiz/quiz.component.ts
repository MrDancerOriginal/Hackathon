import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { Test } from '../../interfaces/test.interface';
import { TestStatus } from '../../enums/test-status.enum';
import { Question } from '../../interfaces/question.interface';
import { Answer } from '../../interfaces/answer.interface';


@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss'
})
export class QuizComponent implements OnInit {
  selectedAnswer: Answer | null = null;
  message: string = '';

  questions: Question[];

  checkAnswer(answer: Answer) {
    this.selectedAnswer = answer;
    this.message = answer.isCorrect ? 'Correct!' : 'Try again.';
  }

  index: number;

  constructor(private quizService: QuizService){}

  ngOnInit(): void {
    this.quizService.generateTest(this.index).subscribe(response => {
      this.questions = response.questions
      console.log(this.questions);
    });
  }


}
