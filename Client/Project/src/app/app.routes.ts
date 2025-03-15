import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './_components/auth/auth.component';
import { RegisterComponent } from './_components/register/register.component';
import { CreateTestComponent } from './_components/create-test/create-test.component';
import { NgModule } from '@angular/core';
import { QuizComponent } from './_components/quiz/quiz.component';

export const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'create-test', component: CreateTestComponent },
  { path: 'quiz', component: QuizComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
