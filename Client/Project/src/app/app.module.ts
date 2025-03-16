import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AuthComponent } from './_components/auth/auth.component';
import { RegisterComponent } from './_components/register/register.component';
import { CreateTestComponent } from './_components/create-test/create-test.component';
import { AppRoutingModule } from './app.routes';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { QuizComponent } from './_components/quiz/quiz.component';
import { TextInputComponent } from './_forms/text-input/text-input.component';
import { QuizzesComponent } from './_components/quizzes/quizzes.component';


@NgModule({
  declarations: [AppComponent,
    AuthComponent,
    RegisterComponent,
    CreateTestComponent,
    QuizComponent,
    TextInputComponent,
    QuizzesComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  bootstrap: [AppComponent],
  providers: [

  ]
})
export class AppModule { }
