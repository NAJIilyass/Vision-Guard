import { Component } from '@angular/core';
import { Router, RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SignUpService } from '../services/sign-up.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private signUpService: SignUpService, private router: Router) {}

  onSubmit(): void {
    this.signUpService.signup(this.email, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Sign-up failed. Please try again.';
      },
    });
  }
}
