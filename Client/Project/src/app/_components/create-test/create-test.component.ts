import { Component, ViewChild, ElementRef } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { AccountService } from '../../services/account.service';
import { GoogleFormService } from '../../services/google-form.service';
import { WorkUser } from '../../interfaces/work-user.interface';
import { ToastrService } from 'ngx-toastr';
import { switchMap, finalize, catchError } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';

@Component({
  selector: 'app-create-test',
  templateUrl: './create-test.component.html',
  styleUrls: ['./create-test.component.scss']
})
export class CreateTestComponent {
  @ViewChild('fileInput') fileInput: ElementRef;
  currentUser: WorkUser;
  selectedFile: File | null = null;
  fileName: string = '';
  currentId = -1;
  testForm: FormGroup;
  isDragging = false;
  isLoading = false;
  isGeneratingGoogleForm = false;

  constructor(
    private fileUploadService: QuizService,
    private toastrService: ToastrService,
    private accountService: AccountService,
    private googleFormsService: GoogleFormService,
    private fb: FormBuilder
  ) {
    this.accountService.currentUser$.subscribe(user => this.currentUser = user);
    this.initForm();
  }

  initForm(): void {
    this.testForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)],
      questionCount: [10, [Validators.required, Validators.min(1), Validators.max(50)]],
      answerOptions: [4, [Validators.required, Validators.min(2), Validators.max(6)]],
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.processSelectedFiles(input.files);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(): void {
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer?.files) {
      this.processSelectedFiles(event.dataTransfer.files);
    }
  }

  private processSelectedFiles(files: FileList | null): void {
    if (files && files.length > 0) {
      const file = files[0];
      const validTypes = ['application/pdf', 'application/msword',
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                         'text/plain'];

      if (!validTypes.includes(file.type)) {
        this.toastrService.error('Unsupported file type. Please upload a PDF, DOC, DOCX, or TXT file.');
        return;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB
        this.toastrService.error('File size exceeds 10MB limit.');
        return;
      }

      this.selectedFile = file;
      this.fileName = file.name;
    } else {
      this.clearFile();
    }
  }

  clearFile(): void {
    this.selectedFile = null;
    this.fileName = '';
    this.fileInput.nativeElement.value = '';
  }

  async onUpload(): Promise<void> {
    if (!this.selectedFile) {
      this.toastrService.warning('Please select a file first');
      return;
    }

    if (this.testForm.invalid) {
      this.markFormAsTouched();
      this.toastrService.warning('Please fill all required fields correctly');
      return;
    }

    this.isLoading = true;
    const formValues = this.testForm.value;

    try {
      // Step 1: Upload the file
      const uploadResponse = await this.fileUploadService.uploadFile(this.selectedFile)
        .pipe(
          catchError(error => {
            this.handleFileUploadError(error);
            return of(null);
          })
        )
        .toPromise();

      if (!uploadResponse) return;

      this.currentId = uploadResponse.pdfFileId;
      this.toastrService.success('File uploaded successfully');

      // Step 2: Create the test with form values
      const testResponse = await this.fileUploadService.createTest(
        formValues.title,
        this.currentUser.id,
        this.currentId,
        [],
        formValues.description,
        formValues.questionCount,
        formValues.answerOptions
      )
      .pipe(
        catchError(error => {
          this.toastrService.error('Failed to create test. Please try again.');
          console.error('Test creation error:', error);
          return of(null);
        })
      )
      .toPromise();

      if (!testResponse) return;

      this.toastrService.success('Test created successfully!');
      this.resetForm();

    } catch (error) {
      console.error('Unexpected error:', error);
      this.toastrService.error('An unexpected error occurred');
    } finally {
      this.isLoading = false;
    }
  }

  async createForm() {
    if (!this.selectedFile) {
      this.toastrService.warning('Please select a file first');
      return;
    }

    if (this.testForm.invalid) {
      this.markFormAsTouched();
      this.toastrService.warning('Please fill all required fields correctly');
      return;
    }

    this.isLoading = true;
    this.isGeneratingGoogleForm = true;
    const formValues = this.testForm.value;

    try {
      const uploadResponse = await this.fileUploadService.uploadFile(this.selectedFile)
        .pipe(
          catchError(error => {
            this.handleFileUploadError(error);
            return of(null);
          })
        )
        .toPromise();

      if (!uploadResponse) return;

      this.currentId = uploadResponse.pdfFileId;

      this.fileUploadService.generateTest(this.currentId).pipe(
        switchMap(questions => {
          const testTitle = formValues.title || `AutoQuiz Test - ${new Date().toLocaleDateString()}`;
          return this.googleFormsService.authenticateUser().pipe(
            switchMap(token => this.googleFormsService.createGoogleForm(
              token,
              testTitle,
              questions
            )),
            catchError(error => {
              this.toastrService.error('Failed to authenticate with Google. Please try again.');
              console.error('Google auth error:', error);
              return of(null);
            })
          );
        }),
        finalize(() => {
          this.isLoading = false;
          this.isGeneratingGoogleForm = false;
        })
      ).subscribe({
        next: (formResponse) => {
          if (!formResponse) return;

          this.toastrService.success('Google Form created successfully!');
          window.open(`https://docs.google.com/forms/d/${formResponse.formId}/edit`, '_blank');
          this.resetForm();
        },
        error: (error) => {
          console.error('Google Form creation error:', error);
          this.toastrService.error('Failed to create Google Form');
        }
      });

    } catch (error) {
      console.error('Unexpected error:', error);
      this.toastrService.error('An unexpected error occurred');
      this.isLoading = false;
      this.isGeneratingGoogleForm = false;
    }
  }

  private handleFileUploadError(error: any): void {
    console.error('File upload error:', error);

    if (error.status === 413) {
      this.toastrService.error('File size is too large (max 10MB)');
    } else if (error.status === 415) {
      this.toastrService.error('Unsupported file type');
    } else {
      this.toastrService.error('Failed to upload file. Please try again.');
    }
  }

  private markFormAsTouched(): void {
    Object.values(this.testForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  public resetForm(): void {
    this.selectedFile = null;
    this.fileName = '';
    this.testForm.reset({
      questionCount: 10,
      answerOptions: 4
    });
    this.fileInput.nativeElement.value = '';
    this.isDragging = false;
  }
}
