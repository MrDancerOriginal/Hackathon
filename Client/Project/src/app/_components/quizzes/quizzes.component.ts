import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { ActivatedRoute } from '@angular/router';
import { TestSummaryDto } from '../../interfaces/test-summary-dto';
import { AccountService } from '../../services/account.service';
import { WorkUser } from '../../interfaces/work-user.interface';
import { TestStatus } from '../../enums/test-status.enum';

@Component({
  selector: 'app-quizzes',
  templateUrl: './quizzes.component.html',
  styleUrls: ['./quizzes.component.scss']
})
export class QuizzesComponent implements OnInit {
  TestStatus = TestStatus; // Make enum available in template
  statusFilter?: TestStatus;
  tests: TestSummaryDto[] = [];
  selectedTestId: number | null = null;
  questions: any[] = [];
  userAnswers: { [key: number]: number | null } = {};
  showResults = false;
  score = 0;
  userId: string | null = null;
  showTooltip = false;
  tooltipText = '';


  constructor(
    private testService: QuizService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    // Get user ID from route parameters
    this.route.params.subscribe(params => {
      this.userId = params['id'];
      if (this.userId) {
        this.loadUserTests(this.userId);
      }
    });
  }

  loadUserTests(userId: string): void {

    this.testService.getTestsByUser(userId).subscribe({
      next: (tests) => {this.tests = tests; console.log(tests)},
      error: (err) => console.error('Failed to load tests', err)
    });
  }

  loadTestQuestions(testId: number): void {
    this.selectedTestId = testId;
    if (this.userId) {
      // this.testService.getTestQuestions(this.userId, testId).subscribe({
      //   next: (questions) => {
      //     this.questions = questions;
      //     this.userAnswers = {};
      //     this.showResults = false;
      //     this.score = 0;
      //   },
      //   error: (err) => console.error('Failed to load questions', err)
      // });
    }
  }

  submitTest(): void {
    this.showResults = true;
    this.score = 0;

    this.questions.forEach(question => {
      if (this.userAnswers[question.id] === question.correctAnswerIndex) {
        this.score++;
      }
    });
  }

  get filteredTests(): TestSummaryDto[] {
    if (!this.statusFilter) return this.tests;
    return this.tests.filter(test => test.status === this.statusFilter);
  }

  async copyQuizLink(pdfFileId: string): Promise<void> {
    const quizUrl = `${window.location.origin}/quiz/${pdfFileId}`;

    try {
      await navigator.clipboard.writeText(quizUrl);
      this.tooltipText = 'Link copied!';
      this.showTooltip = true;
      setTimeout(() => this.showTooltip = false, 2000);
    } catch (err) {
      this.tooltipText = 'Failed to copy';
      this.showTooltip = true;
      setTimeout(() => this.showTooltip = false, 2000);
    }
  }
}
