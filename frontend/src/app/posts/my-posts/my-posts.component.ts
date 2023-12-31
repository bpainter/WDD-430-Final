import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { AuthService } from '../../auth/auth.service';
import { PostService } from '../../services/post.service';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../profile/profile.model';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.scss']
})

export class MyPostsComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  postbyUser: Profile[] = []
  isloading = false;
  error: any
  userId: string
  private postsSub: Subscription;
  constructor(
    private ps: PostService, 
    private authService: AuthService,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.getErrors();
    this.isloading = true;
    this.userId = this.authService.getUserId();
    this.getMyPost();

    this.postsSub = this.ps.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.getPostUserbyCreatorId(posts);
        this.isloading = false;
        this.posts = posts;
      }, e => {
        this.isloading = false;
        this.error = e
      });
  }

  getPostUserbyCreatorId(post: Post[]) {
    let creatorId = []
    for (let i in post) {
      creatorId.push(post[i].creator)
    }

    let unique = [...new Set(creatorId)];
    for (let i in unique) {
      this.profileService.getPostUserByCreatorId(unique[i])
        .subscribe(user => {
          this.postbyUser.push(user.profile)
        });
    }
  }

  getErrors() {
    this.error = null
    this.ps.err.subscribe(err => {
      this.error = err
      this.isloading = false
    });
  }

  getMyPost() {
    this.ps.getMyPost(this.userId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}