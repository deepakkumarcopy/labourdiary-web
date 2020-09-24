import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';

@Component({
	selector: 'app-sign-up',
	templateUrl: './sign-up.component.html',
	styleUrls: ['./sign-up.component.scss']
})

export class SignUpComponent implements OnInit {

	signUpForm: any;
	isAccountActive: boolean = false;
	imageData: any = null;
	base64String: string = '';

	constructor(
		private authService: AuthService,
		private modalService: ModalService,
		) { }

	ngOnInit(): void {
		let EmailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
		this.signUpForm = new FormGroup({
			firstName: new FormControl(''),
			lastName: new FormControl(''),
			email: new FormControl('', [Validators.required, Validators.pattern(EmailPattern)]),
			password: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.minLength(6)]),
			tc: new FormControl('', [Validators.required]),
			gdpr: new FormControl('', [Validators.required])
		});
	}

	onSubmit() {

		let data = {
			firstName: this.signUpForm.value.firstName,
			lastName: this.signUpForm.value.lastName,
			email: this.signUpForm.value.email,
			password: this.signUpForm.value.password,
			imageData: this.imageData,
		}
		this.authService.signUp(data).subscribe((res) => {
			if (res.success) {
				this.modalService.close('sign-up');
			}
		})
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
			}
		}).catch((error) => {
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

	goToLogin() {
		this.modalService.close('sign-up');
		this.modalService.open('login');
	}

	closeModal(id) {
		this.modalService.close('sign-up');
		this.signUpForm.reset();
		this.base64String = '';
	}

	onselect(event) {
		this.imageData = event[0];
		let readBase64 = new FileReader();
			readBase64.onload = (e: any) => {
				this.base64String = e.target.result
			};
			readBase64.readAsDataURL(this.imageData);
		console.log(event)
	}
}
