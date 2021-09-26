import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend
import { fakeBackendProvider } from './_helpers';

import { appRoutingModule } from './app.routing';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AppComponent } from './app.component';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AlertComponent } from './_components';
import { MatDialogModule } from '@angular/material/dialog';;
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';;
import { LoaderComponent } from './_helpers/loader/loader.component';
import { ToastrModule } from 'ngx-toastr'

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    appRoutingModule,
    MatDialogModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(
      {
        progressBar: true,
        timeOut: 3000,
        maxOpened: 5,
        preventDuplicates: true
      }
    )
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    LoaderComponent,
    AlertComponent],
  entryComponents: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { };