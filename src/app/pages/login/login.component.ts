import { Component, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { error } from 'protractor';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

// Services
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';
import { CommonService } from '../../services/common.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

	loginForm: any;
	isValidEmailPass: boolean = false;
	isAccountActive: boolean = false;

	constructor(
		private router: Router,
		private modalService: ModalService,
		private FormBuilder: FormBuilder,
		private authService: AuthService,
		private common: CommonService,
		private toastr: ToastrService,
		private location: Location
	) {
	}

	ngOnInit(): void {
		let emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
		this.loginForm = this.FormBuilder.group({
			email: new FormControl('', [Validators.required, Validators.pattern(emailPattern)]),
			password: new FormControl('', [Validators.required, Validators.maxLength(30), Validators.minLength(6)]),
		});
	}

	onSubmit() {
		this.isValidEmailPass = false;
		this.isAccountActive = false;
		this.authService.login(this.loginForm.value).subscribe((res) => {
			if (res.success) {
				if (res.user.active) {
					if (res.user.verified) {
						this.toastr.success('Successfully login!');
						localStorage.setItem('token', JSON.stringify(res.token));
						localStorage.setItem('user', JSON.stringify(res.user));
						this.location.back();
					} else {
						this.router.navigate(['verify', this.loginForm.value.email])
					}
				} else {
					this.isAccountActive = true;
				}
			} else {
				this.isValidEmailPass = true;
				this.toastr.info('Credential are wrong!');
			}
		}, (error) => {
			this.toastr.error('Something went wrong please try again later!');
			this.isValidEmailPass = true;
		})
	}

	closeModal(id: string) {
		this.modalService.close(id)
	}

	openModal(id: string) {
		this.modalService.open(id);
	}

	checkFields() {

	}

	forgetPassword() {

	}

	googleLogin() {
		this.authService.googleLogin().then((res: any) => {
			if (res.success) {
				if (res.user.active) {
					localStorage.setItem('token', JSON.stringify(res.token));
					localStorage.setItem('user', JSON.stringify(res.user));
					this.location.back();
				} else {
					this.isAccountActive = true;
				}
			} else {
				this.isValidEmailPass = true;
			}
		}).catch((error) => {
			this.isValidEmailPass = true;
		})
	}

	facebookLogin() {
		this.authService.facebookLogin().then((res: any) => {
			if (res.success) {
				if (res.user.active) {
					localStorage.setItem('token', JSON.stringify(res.token));
					localStorage.setItem('user', JSON.stringify(res.user));
					this.location.back();
				} else {
					this.isAccountActive = true;
				}
			} else {
				this.isValidEmailPass = true;
			}
		})
	}

	linkedInLogin() {
		this.authService.linkedInLogin()
	}
}