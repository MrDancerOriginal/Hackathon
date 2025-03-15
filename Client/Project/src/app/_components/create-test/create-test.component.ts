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
  fileName: string = 'Файл не обрано';
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



  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.fileName = this.selectedFile.name;
    } else {
      this.selectedFile = null;
      this.fileName = 'Файл не обрано';
    }
  }

  onGenerate():void{
    this.fileUploadService.generateTest(1).subscribe((response) => {
      console.log(response)
    });
  }

  onLoad():void{
    document.getElementById('file-upload')?.click();
  }

  onUpload(): void {
    this.fileUploadService.uploadFile(this.selectedFile).subscribe(
      (response) => {
        this.currentId = response;
        console.log('File uploaded successfully:', response);
      },
      (error) => {
        console.error('File upload failed:', error);
      }
    );
  }
}
