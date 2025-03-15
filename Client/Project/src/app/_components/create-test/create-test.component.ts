import { Component } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-test',
  templateUrl: './create-test.component.html',
  styleUrl: './create-test.component.scss'
})
export class CreateTestComponent {
  selectedFile: File | null = null;

  constructor(private fileUploadService: QuizService) {
    console.log('CreateTestComponent initialized');
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onUpload(): void {
    if (this.selectedFile) {
      this.fileUploadService.uploadFile(this.selectedFile).subscribe(
        (response) => {
          console.log('File uploaded successfully:', response);
        },
        (error) => {
          console.error('File upload failed:', error);
        }
      );
    } else {
      alert('Please select a file first.');
    }
  }
}
