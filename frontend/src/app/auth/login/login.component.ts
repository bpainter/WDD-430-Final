// Import required modules
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

// Import other components
import { AuthService } from '../auth.service';

// Component metadata
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * LoginComponent is responsible for handling user login and signup.
 * It uses AuthService for authentication operations.
 */
export class LoginComponent implements OnInit {
  // Define initial state
  isLoginMode = true; // Boolean to toggle between login and signup mode
  isLoading = false; // Boolean to handle loading state
  error: any = null; // Variable to store any error messages

  // Inject AuthService in the constructor
  constructor(private authService: AuthService) { }

  /**
   * OnInit lifecycle hook.
   * Reset error state and subscribe to error observable from AuthService.
   * If an error occurs during authentication, update the error state and stop loading.
   */
  ngOnInit(): void {
    this.error = null
    this.authService.err.subscribe(err => {
      this.error = err
      this.isLoading = false
    });
  }

  /**
   * Method to switch between login and signup mode.
   */
  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  /**
   * Method to handle form submission.
   * If form is invalid, return and stop execution.
   * Extract email and password from form.
   * If in login mode, call signIn method from AuthService.
   * If in signup mode, call createUser method from AuthService.
   * @param {NgForm} form - The form that is being submitted.
   */
  onSubmit(form: NgForm) {
    this.isLoading = true;
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    if (this.isLoginMode) {
      this.authService.signIn(email, password)
      form.reset();
    }
    else {
      this.authService.createUser(email, password);
      form.reset();
    }
  }
}