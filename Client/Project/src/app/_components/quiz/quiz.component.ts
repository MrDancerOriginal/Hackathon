import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { Test } from '../../interfaces/test.interface';
import { TestStatus } from '../../enums/test-status.enum';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss'
})
export class QuizComponent implements OnInit {
  test: Test = {
    id: 1,
    title: 'Sample Test',
    description: 'This is a sample test description.',
    authorId: 'user123',
    dateCreated: new Date().toISOString(),
    status: TestStatus.Draft,
    questions: [
      {
        id: 1,
        text: 'What is Angular?',
        order: 1,
        answers: [
          { id: 1, text: 'A framework', isCorrect: true },
          { id: 2, text: 'A library', isCorrect: false }
        ]
      },
      {
        id: 2,
        text: 'Which language does Angular use?',
        order: 2,
        answers: [
          { id: 3, text: 'JavaScript', isCorrect: false },
          { id: 4, text: 'TypeScript', isCorrect: true }
        ]
      }
    ]
  };

  index: number;

  constructor(private quizService: QuizService){}

  ngOnInit(): void {
    //this.quizService.generateTest(this.index);
  }


}
