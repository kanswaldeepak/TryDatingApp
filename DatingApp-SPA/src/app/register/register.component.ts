import { Router } from '@angular/router';
import { AlertifyService } from './../_services/alertify.service';
import { AuthService } from './../_services/auth.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { User } from '../_models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
 user: User;
 registerForm: FormGroup;
 @Output() cancelRegister = new EventEmitter();
  constructor(private authService: AuthService, private alertify: AlertifyService,
              private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.createRegistrationForm();
    // this.registerForm = new FormGroup ({
    //   userName: new FormControl('', Validators.required),
    //   password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]),
    //   confirmPassword: new FormControl('', Validators.required)
    // }, this.passwordMisMatch );
  }

createRegistrationForm() {
  this.registerForm = this.fb.group({
    gender: ['male'],
    userName: ['', Validators.required ],
    knownAs: ['',  Validators.required],
    dateOfBirth: [null,  Validators.required],
    city: ['',  Validators.required],
    country: ['',  Validators.required],
    password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]],
    confirmPassword: ['', Validators.required]
  }, {validators: this.passwordMisMatch});
}

  passwordMisMatch(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value ? null : { mismatch: true};
  }

  register() {
    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);
      this.authService.register(this.user).subscribe(() => {
        this.alertify.success('Registration Succesfull');
      }, error => {
        this.alertify.error(error);
      }, () => {
        this.authService.login(this.user).subscribe(() => {
          this.router.navigate(['/members']);
        });
      });
    }
  }

  cancel() {
    this.cancelRegister.emit(false);
    this.alertify.message('cancelled');
  }

}
