import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllPostsComponent } from './posts/all-posts/all-posts.component';
import { CreatePostComponent } from './posts/create-post/create-post.component';
import { PostDetailComponent } from './posts/post-detail/post-detail.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { MyPostsComponent } from './posts/my-posts/my-posts.component';
import { CreateProfileComponent } from './profile/create-profile/create-profile.component';
import { ViewProfileComponent } from './profile/view-profile/view-profile.component';

const routes: Routes = [
  { path: '', component: AllPostsComponent },
  { path: 'myposts', component: MyPostsComponent ,canActivate: [AuthGuard]},
  { path: 'create', component: CreatePostComponent ,canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent },
  { path: 'myposts/:postId', component: PostDetailComponent ,canActivate: [AuthGuard]},
  { path: 'myposts/edit/:postId', component: CreatePostComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: CreateProfileComponent,canActivate: [AuthGuard] },
  { path: 'public/:profileId', component: ViewProfileComponent },
  { path: 'profile/:profileId', component: ViewProfileComponent,canActivate: [AuthGuard]  },
  { path: 'profile/edit/:profileId', component: CreateProfileComponent,canActivate: [AuthGuard]  },
  { path: 'public/:profileId/posts/:postId', component: PostDetailComponent },
  { path: ':postId', component: PostDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
