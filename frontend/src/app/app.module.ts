import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'
import { FormsModule }   from '@angular/forms';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AllPostsComponent } from './posts/all-posts/all-posts.component';
import { CreatePostComponent } from './posts/create-post/create-post.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { PostService } from './services/post.service';
import { LoadingComponent } from './loading/loading.component';
import { PostDetailComponent } from './posts/post-detail/post-detail.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { MyPostsComponent } from './posts/my-posts/my-posts.component';
import { CreateProfileComponent } from './profile/create-profile/create-profile.component';
import { ViewProfileComponent } from './profile/view-profile/view-profile.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AllPostsComponent,
    CreatePostComponent,
    LoadingComponent,
    PostDetailComponent,
    LoginComponent,
    MyPostsComponent,
    CreateProfileComponent,
    ViewProfileComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [PostService,
    AuthService,AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
