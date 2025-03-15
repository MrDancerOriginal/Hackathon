import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { FormsModule } from '@angular/forms';
import { TestingService } from '../../services/testing.service';

@Component({
  selector: 'app-create-test',
  templateUrl: './create-test.component.html',
  styleUrl: './create-test.component.scss'
})
export class CreateTestComponent implements OnInit {

  //Кількість питань, кількість відповідей, назва, файл
  selectedFile: File | null = null;
  currentId = -1;

  constructor(private fileUploadService: QuizService, private testingService: TestingService) {
    console.log('CreateTestComponent initialized');

  }

  ngOnInit(): void {
    console.log("Loading")

    this.testingService.getRequest().subscribe(
      (response) => {
        // Успішна відповідь
        console.log('Status Code:', response.status);  // Вивести код статусу
        console.log('Response Body:', response);  // Вивести відповідь
      },
      (error) => {
        // Обробка помилки
        console.error('Error:', error);
      }
    );
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onGenerate():void{
    this.fileUploadService.generateTest(this.currentId);
  }

  onUpload(): void {
    if (this.selectedFile) {
      this.fileUploadService.uploadFile(this.selectedFile).subscribe(
        (response) => {
          this.currentId = response;
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
