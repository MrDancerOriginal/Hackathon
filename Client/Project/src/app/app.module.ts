import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AuthComponent } from './_components/auth/auth.component';
import { RegisterComponent } from './_components/register/register.component';
import { CreateTestComponent } from './_components/create-test/create-test.component';
import { AppRoutingModule } from './app.routes';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [AppComponent, AuthComponent, RegisterComponent, CreateTestComponent],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  bootstrap: [AppComponent],
  providers: [

  ]
})
export class AppModule { }
