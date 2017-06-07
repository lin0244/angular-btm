import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';

import { Parameter } from './parameter.service';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    HttpModule,
    JsonpModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [Parameter],
  bootstrap: [AppComponent]
})
export class AppModule { }
