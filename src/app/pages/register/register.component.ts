import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  myform: FormGroup;
  confirmPassword: string = '';
  constructor(private router: Router, private authService: AuthService) {
    this.myform = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
    });
  }

  public register = () => {
    const isPasswordCorrect = this.checkIsConfirmPasswordCorrect(
      this.myform.get('password')?.value,
      this.confirmPassword
    );

    if (this.myform.valid && isPasswordCorrect) {
      let user = { ...this.myform.value, role: 1 };
      this.authService.register(user).subscribe((res) => {
        this.router.navigate(['/login']);
      });
    }
  };

  public backToLogin = () => {
    this.router.navigate(['/login']);
  };

  private checkIsConfirmPasswordCorrect = (
    password: string,
    confirmPassword: string
  ) => {
    return password === confirmPassword;
  };
}
