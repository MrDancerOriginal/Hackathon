import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { ActivatedRoute } from '@angular/router';
import { Question } from '../../interfaces/question.interface';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  questions: Question[] = [];
  currentQuestionIndex = 0;
  selectedAnswers: { [key: number]: number } = {};
  quizSubmitted = false;
  score = 0;
  totalQuestions = 0;
  quizTitle = 'Advanced Anatomy Practice Test';
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const quizId = params['id'];
      if (quizId) {
        this.loadQuiz(+quizId);
      } else {
        this.errorMessage = 'No quiz ID provided';
        this.isLoading = false;
        this.loadMockData(); // Load mock data immediately if no ID
      }
    });
  }

  loadQuiz(quizId: number): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.quizService.generateTest(quizId).subscribe({
      next: (questions: any) => {
        console.log('Received questions:', questions);
        this.questions = questions.questions;
        this.totalQuestions = questions.questions.length;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load quiz', err);
        this.errorMessage = 'Failed to load quiz. Please try again later.';
        this.isLoading = false;
        this.loadMockData();
      }
    });
  }

  private loadMockData(): void {
    this.questions = [
      {
        questionText: "Which of the following structures does not pass through the foramen jugulare?",
        answers: [
          { answerText: "Arteria carotis interna", isCorrect: false },
          { answerText: "Vena jugularis interna", isCorrect: false },
          { answerText: "Nervus vagus", isCorrect: false },
          { answerText: "Sinus petrosus inferior", isCorrect: false },
          { answerText: "Arteria meningea posterior", isCorrect: true }
        ]
      },
      // ... other mock questions ...
    ];
    this.totalQuestions = this.questions.length;
  }

  selectAnswer(questionIndex: number, answerIndex: number): void {
    this.selectedAnswers[questionIndex] = answerIndex;
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.totalQuestions - 1) {
      this.currentQuestionIndex++;
    }
  }

  prevQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  submitQuiz(): void {
    this.quizSubmitted = true;
    this.score = 0;

    this.questions.forEach((question, index) => {
      const selectedAnswerIndex = this.selectedAnswers[index];
      if (selectedAnswerIndex !== undefined &&
          question.answers[selectedAnswerIndex].isCorrect) {
        this.score++;
      }
    });
  }

  isSelected(questionIndex: number, answerIndex: number): boolean {
    return this.selectedAnswers[questionIndex] === answerIndex;
  }

  isCorrectAnswer(questionIndex: number, answerIndex: number): boolean {
    return this.quizSubmitted && this.questions[questionIndex].answers[answerIndex].isCorrect;
  }

  isWrongAnswer(questionIndex: number, answerIndex: number): boolean {
    return this.quizSubmitted &&
           this.selectedAnswers[questionIndex] === answerIndex &&
           !this.questions[questionIndex].answers[answerIndex].isCorrect;
  }

  resetQuiz(): void {
    this.currentQuestionIndex = 0;
    this.selectedAnswers = {};
    this.quizSubmitted = false;
    this.score = 0;
  }
}
