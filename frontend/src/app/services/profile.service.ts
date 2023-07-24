import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { Profile } from '../profile/profile.model';
import { AuthService } from '../auth/auth.service';
import {environment} from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + "/profile"

@Injectable({
  providedIn: 'root'
})

export class ProfileService {
  private profile: Profile;
  private isProfileSet: boolean = false; // Original
  private updatedProfile = new Subject<Profile>();
  public err = new BehaviorSubject<any>(null);
  constructor(
    private http: HttpClient, 
    private router: Router,
  ) { }

  getProfileUpdateListener() {
    return this.updatedProfile.asObservable();
  }

  getIsProfile() {
    return this.profile;
  }

  getIsProfileSet() {
    return this.isProfileSet;
  }

  addProfile(title: string, content: string, imgpath: File) {
    const postData = new FormData();
    postData.append("username", title);
    postData.append("bio", content);
    postData.append("image", imgpath, title);

    this.http
      .post<{ message: string; post: Profile }>(
        BACKEND_URL +"/create",
        postData
      )
      .subscribe(responseData => {
        this.router.navigate(['/'])
        this.err.next(null)
      },
        err => {
          this.err.next(err)
        })
  }

  updateProfile(id: string, username: string, bio: string, image: File | string) {
    let profileData: Profile | FormData;
    if (typeof image === "object") {
      profileData = new FormData();
      profileData.append("id", id);
      profileData.append("username", username);
      profileData.append("bio", bio);
      profileData.append("image", image, username);
    } else {
      profileData = {
        id: id,
        username: username,
        bio: bio,
        imagePath: image,
        creator: null
      };
    }

    this.http
      .put(BACKEND_URL+"/edit/" + id, profileData)
      .subscribe(response => {

        this.err.next(null)
        this.router.navigate(["/profile"]);
      },
        err => {
          console.log(err)
          this.err.next(err)
        });
  }

  getProfile(token:string = null) {
    // console.log('---------- getProfile debug ----------');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', 'Bearer ' + token);
    }

    this.http.get<{ profile: any, message: string }>(BACKEND_URL + "/viewprofile", { headers }) 
      .subscribe(profile => {
        let prof = profile.profile;
        this.profile = prof;
        this.isProfileSet = true;
        this.updatedProfile.next(profile.profile);
        this.saveProfileData(profile.profile);
      },
      err => {
        console.log(err)
        this.err.next(err)
      })
  }

  getProfileByCreatorId() {
    // console.log('---------- getProfileByCreatorId debug ----------');
    return this.http.get<{ profile: any, message: string }>(BACKEND_URL+"/viewprofile");
  }
  
  getPostUserByCreatorId(creatorId) {
    // console.log('---------- getPostUserByCreatorId debug ----------');  
    return this.http.get<{ profile: any, message: string }>(BACKEND_URL+"/bycreator/" + creatorId);
  }

  getAllUsers() {
    // console.log('---------- getAllUsers debug ----------'); 
    return this.http.get<{ profile: any, message: string }>(BACKEND_URL+"/profiles");
  }
  
  getProfileByUsername(uname: string, token: string = null) {
    // console.log('---------- getProfileByUsername debug ----------');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', 'Bearer ' + token);
    }
    return this.http.get<{ profile: any, message: string }>(BACKEND_URL +"/"+ uname, { headers });
  }

  getMyPost(uname: string) {
    // console.log('---------- getMyPost debug ----------');
    return this.http.get<{ post: any, message: string }>(BACKEND_URL +"/"+ uname + "/mypost");
  }

  saveProfileData(profile) {
    // console.log('---------- saveProfileData debug ----------'); 
    localStorage.setItem("profile", JSON.stringify(profile));
    localStorage.setItem("uname", profile.username)
  }


  // Original
  autogetProfile() {
    // console.log('---------- autogetProfile debug ----------');
    const profile = localStorage.getItem("profile")
    if (profile) {
      this.isProfileSet = true
      // console.log('Profile data from local storage: ', profile);
    } else {
      // console.log('No profile data from local storage.');
    }
  }
}