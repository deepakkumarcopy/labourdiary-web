import { Component, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import * as $ from 'jquery';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

@Component({
	selector: 'app-forget-password',
	templateUrl: './forget-password.component.html',
	styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {


	passwordForm: any;
	verificationForm: any;
	emailForm: any;
	verifyForm: any;
	isOtpSend: boolean = false;
	isOtpValid: boolean = false;
	spinner: boolean = false;
	isPresent: boolean = false;
	isNotPresent: boolean = false;
	emailAlreadyExist: boolean = false;

	constructor(
		private toaster: ToastrService,
		private location: Location,
		private api: ApiService,
		private formBuilder: FormBuilder
	) { }

	ngOnInit(): void {

		let EMAILPATTERN = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
		this.emailForm = this.formBuilder.group({
			email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
		});

		this.passwordForm = this.formBuilder.group({
			password: new FormControl('', [Validators.minLength(6), Validators.maxLength(15), Validators.required]),
			confirmPassword: new FormControl('', [Validators.minLength(6), Validators.maxLength(15), Validators.required])
		}, {
			validators: this.passwordConfirming
		});

		this.verifyForm = this.formBuilder.group({
			code1: new FormControl('', [Validators.required, Validators.maxLength(1), Validators.minLength(1)]),
			code2: new FormControl('', [Validators.required, Validators.maxLength(1), Validators.minLength(1)]),
			code3: new FormControl('', [Validators.required, Validators.maxLength(1), Validators.minLength(1)]),
			code4: new FormControl('', [Validators.required, Validators.maxLength(1), Validators.minLength(1)]),
			code5: new FormControl('', [Validators.required, Validators.maxLength(1), Validators.minLength(1)]),
			code6: new FormControl('', [Validators.required, Validators.maxLength(1), Validators.minLength(1)]),
		});

		this.otpInputJsCall();
	}


	passwordConfirming(c: AbstractControl): { invalid: boolean } {
		if (c.get('password').value !== c.get('confirmPassword').value) {
			return { invalid: true };
		}
	}

	checkFieldEmail(event) {
		console.log(event)
		let EmailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
		if (EmailPattern.test(event)) {
			this.spinner = true;
			this.isPresent = false;
			this.isNotPresent = false;
			this.emailAlreadyExist = false;
			this.api.checkEmail(event).subscribe((res) => {
				this.spinner = false;
				if (res.success) {
					this.emailAlreadyExist = false;
					this.isNotPresent = false;
					this.isPresent = true;
				}
			}, (error) => {
				this.emailAlreadyExist = true;
				this.isPresent = false;
				this.isNotPresent = true;
				this.spinner = false;
			});
		} else {
			this.isPresent = false;
			this.isNotPresent = true;
		}
	}

	sendOTP() {
		this.api.sendOTP(this.emailForm.value.email).subscribe((res) => {
			if (res.status) {
				this.isOtpSend = true;
				setTimeout(() => {
					this.otpInputJsCall();
				})
				this.toaster.success('Otp sent !');
			} else {
				this.toaster.warning(res.message);
			}
		}, (e => {
			this.toaster.error('unable to send OTP !');
		}));
	}
	
	otpInputJsCall() {
		$('.digit-group').find('input').each(function () {
			$(this).attr('maxlength', 1);
			$(this).on('keyup', function (e: any) {
				var parent = $($(this).parent());
				
				if (e.keyCode === 8 || e.keyCode === 37) {
					var prev = parent.find('input#' + $(this).data('previous'));
					
					if (prev.length) {
						$(prev).select();
					}
				} else if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode === 39) {
					var next = parent.find('input#' + $(this).data('next'));
					var current = parent.find('input#' + $(this).data('current'));
					if (next.length && !!current[0].value) {
						$(next).select();
					} else {
						if (parent.data('autosubmit')) {
							parent.submit();
						}
					}
				} else {
					var current = parent.find('input#' + $(this).data('current'));
					current[0].value = ""
				}
			});
		});
	}

	verifyOtp() {
		let code = `${this.verifyForm.value.code1}${this.verifyForm.value.code2}${this.verifyForm.value.code3}${this.verifyForm.value.code4}${this.verifyForm.value.code5}${this.verifyForm.value.code6}`

		this.api.verifyOTP({ email: this.emailForm.value.email, otp: code }).subscribe((res) => {
			if (res.success) {
				this.isOtpValid = true;
				this.toaster.success('Otp verified !');
			} else {
				this.toaster.warning(res.message);
			}
		}, (e) => {
			this.toaster.error('unable to process request!');
		});
	}

	changePassword() {
		if (this.passwordForm.status == 'VALID') {
			this.api.changePassword({ email: this.emailForm.value.email, password: this.passwordForm.value.password }).subscribe((res) => {
				if(res.success) {
					this.location.back();
				} else {
					this.toaster.warning('unable to change password !');
				}
			}, (e => {
				this.toaster.error('unable to process request!');
			}));
		} else {
			if (this.passwordForm.value.password == this.passwordForm.value.confirmPassword) {
				// this.notmatch = true;
			} else {
				// this.passwordLength = true;
			}
		}
	}



}
