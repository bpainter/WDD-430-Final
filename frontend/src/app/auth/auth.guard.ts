// Include required modules
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

// Include other required files
import { AuthService } from './auth.service';

/**
 * AuthGuard is a service that decides if a route can be activated or not 
 * based on the user's authentication status.
 * If the user is not authenticated, they are redirected to the login page.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  /**
   * This method checks if the user is authenticated. If not, it navigates to the login page.
   * @param {ActivatedRouteSnapshot} route - Information about the current route.
   * @param {RouterStateSnapshot} state - The state of the router at this cycle.
   * @returns {boolean | Observable<boolean> | Promise<boolean>} 
   * - Returns true if the user is authenticated, otherwise false.
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const isAuth = this.authService.getIsAuth();
    console.log("-----------aug.guard debug -----------");
    console.log("isAuth: ", isAuth);
    if (!isAuth) {
      this.router.navigate(['/login']);
    }
    return isAuth;
  }
}