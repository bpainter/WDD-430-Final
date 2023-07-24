// Import required modules
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Import other required files
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';

/**
 * AuthInterceptor is a service that intercepts HTTP requests and adds an Authorization header.
 * This header includes the user's authentication token, which is used to authenticate 
 * the user on the server.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

   /**
   * This method intercepts the HTTP request, clones it, 
   * adds an Authorization header to the cloned request,
   * and then passes the cloned request to the next handler in the chain.
   * @param {HttpRequest<any>} req - The outgoing request to modify.
   * @param {HttpHandler} next - The next handler in the HTTP request chain.
   * @returns The transformed HTTP request.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getToken();
    const authRequest = req.clone({
      headers: req.headers.set("Authorization", "Bearer " + authToken)
    });
    return next.handle(authRequest);
  }
}