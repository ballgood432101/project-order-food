import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  myform: FormGroup;

  constructor(private authService: AuthService, private router: Router) {
    this.myform = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  public login = () => {
    if (this.myform.valid) {
      this.authService.login(this.myform.value).subscribe(
        (res) => {
          this.router.navigate(['/home']);
        },
        (err) => {
          alert(err);
        }
      );
    }
  };

  public register = () => {
    this.router.navigate(['/register']);
  };
}
