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

  questions: Question[] = [
    {
      QuestionText: 'Generated question',
      Answers: [
        { AnswerText: 'Correct answer', IsCorrect: true },
        { AnswerText: 'Incorrect answer 1', IsCorrect: false },
        { AnswerText: 'Incorrect answer 2', IsCorrect: false },
        { AnswerText: 'Incorrect answer 3', IsCorrect: false }
      ]
    }
  ];

  checkAnswer(answer: Answer) {
    this.selectedAnswer = answer;
    this.message = answer.IsCorrect ? 'Correct!' : 'Try again.';
  }

  index: number;

  constructor(private quizService: QuizService){}

  ngOnInit(): void {
    this.quizService.generateTest(this.index).subscribe(response => {
      this.questions = response;
    });
  }


}
