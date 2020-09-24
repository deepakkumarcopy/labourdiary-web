import { Component, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { error } from 'protractor';

// Services
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';

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
		private modalService: ModalService,
		private FormBuilder: FormBuilder,
		private authService: AuthService,
	) { }

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
					console.log(res)
					this.modalService.close('login')
				} else {
					this.isAccountActive = true;
				}
			} else {
				this.isValidEmailPass = true;
			}
		}, (error) => {
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
					this.modalService.close('login');
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
		this.authService.facebookLogin().then((res) => {
			console.log(res)
		})
	}

	linkedInLogin() {
		this.authService.linkedInLogin()
	}
}
