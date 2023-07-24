import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Profile } from '../profile/profile.model';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  profile: any;
  username: string;
  profileisSet = false;
  constructor(
    private authService: AuthService, 
    private profileService: ProfileService,
    private route: ActivatedRoute
  ) { }
  
  // Original
  ngOnInit(): void {
    this.profileisSet = this.profileService.getIsProfileSet()
    this.userIsAuthenticated = this.authService.getIsAuth();

    if (this.userIsAuthenticated) {
      this.getProfile()
    }

    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        if (this.userIsAuthenticated) {
          this.getProfile()
        }
    });
  }

  onLogout() {
    this.authService.logout();
  }

  getProfile() {
    // console.log('------------- getProfile debug --------------');
    this.profileService.getProfileByCreatorId().subscribe(prof => {
      this.profileisSet = true;
      this.username = prof.profile.username;
      this.profile = {
        id: prof.profile._id,
        username: prof.profile.username,
        bio: prof.profile.bio,
        imagePath: prof.profile.imagePath,
        creator: prof.profile.creator
      };
      // console.log('profileisSet', this.profileisSet);
      // console.log('Response from getProfileByCreatorId:', prof);
      // console.log('Response from getProfileByCreatorId----username:', prof.profile.username);
    },
    err => {
      this.profileisSet = false;
      this.username = null;
      // console.log('profileisSet', this.profileisSet);
    });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}