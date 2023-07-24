import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { Post } from '../posts/post.model';
import { environment } from '../../environments/environment'
import { AuthService } from '../auth/auth.service';

const BACKEND_URL = environment.apiUrl + "/posts"
// Largely changed back to the original
// Passing token + auth headers to the CRUD interfaces
@Injectable({
  providedIn: 'root'
})

export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  public err = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient, 
    private router: Router,
    private authService: AuthService
  ) { }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, imgpath: File, postDate: Date) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", imgpath, title);
    postData.append("postDate", postDate.toString());

    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authService.getToken());

    this.http
      .post<{ message: string; post: Post }>(BACKEND_URL, postData, { headers: headers })
      .subscribe(
        responseData => {
          this.err.next(null)
          this.router.navigate(["/"]);
        },
        err => {
          this.err.next(err)
        }
      );
  }

  getPosts() {
    this.http.get<{ message: string; posts: any }>(BACKEND_URL)
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator,
              postDate: post.postDate
            };
          });
        })
      )
      .subscribe(transformedPosts => {
        this.err.next(null)
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      },
        err => {
          this.err.next(err)
        });
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string, title: string, content: string, imagePath: string,
      creator: string,postDate:Date;
    }>(
      BACKEND_URL +"/" + id
    );
  }

  getMyPost(id: string) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    this.http.get<{ message: string; posts: any }>(BACKEND_URL + "/myposts", { headers: headers }
    ).pipe(
      map(postData => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator,
            postDate: post.postDate
          };
        });
      })
    )
    .subscribe(transformedPosts => {
      this.err.next(null);
      this.posts = transformedPosts;
      this.postsUpdated.next([...this.posts]);
    },
    err => {
      this.err.next(err);
    });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }

    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authService.getToken());

    this.http
      .put(BACKEND_URL + "/" +id, postData, { headers: headers })
      .subscribe(
        response => {
          this.err.next(null)
          this.router.navigate(["/myposts"]);
        },
        error => {
          this.err.next(error)
        }
      );
  }

  deletePost(postId: string) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authService.getToken());
    this.http
      .delete(BACKEND_URL +"/"+ postId, { headers: headers })
      .subscribe((data) => {
        this.err.next(null)
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      },
      e => {
        // console.log('Error occurred during delete request:', e); 
        this.err.next(e);
      });
  }
}