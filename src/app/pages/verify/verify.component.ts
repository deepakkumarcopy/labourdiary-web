import { Component, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import * as $ from 'jquery';
import { ApiService } from '../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-verify',
	templateUrl: './verify.component.html',
	styleUrls: ['./verify.component.scss']
})

export class VerifyComponent implements OnInit {

	verify: any;
	email: any;

	constructor(
		private router: Router,
		private api: ApiService,
		private route: ActivatedRoute,
		private toastr: ToastrService,
		private FormBuilder: FormBuilder,
	) { }

	ngOnInit(): void {
		this.route.params.subscribe((params) => {
			console.log(params.email)
			this.email = params.email;
			this.sendOtp();
		})
		this.createForm();
		this.otpInputJsCall();
	}

	sendOtp() {
		this.api.sendOTP(this.email).subscribe((res) => {
			if (res.status) {
				this.toastr.success('OTP sent !');
			} else {
				this.toastr.success('Unable to send OTP !');
			}
		}, (e) => {
			this.toastr.success('Unable to send OTP !');
		});
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
	
	createForm() {
		this.verify = this.FormBuilder.group({
			code1: new FormControl('', [Validators.required, Validators.maxLength(1), Validators.minLength(1)]),
			code2: new FormControl('', [Validators.required, Validators.maxLength(1), Validators.minLength(1)]),
			code3: new FormControl('', [Validators.required, Validators.maxLength(1), Validators.minLength(1)]),
			code4: new FormControl('', [Validators.required, Validators.maxLength(1), Validators.minLength(1)]),
			code5: new FormControl('', [Validators.required, Validators.maxLength(1), Validators.minLength(1)]),
			code6: new FormControl('', [Validators.required, Validators.maxLength(1), Validators.minLength(1)]),
		});
	}

	onSubmit() {
		let code = `${this.verify.value.code1}${this.verify.value.code2}${this.verify.value.code3}${this.verify.value.code4}${this.verify.value.code5}${this.verify.value.code6}`

		this.api.verifyOTP({ email: this.email, otp: code }).subscribe((res) => {
			if (res.success) {
				this.router.navigate(['']);
			} else {
			}
		}, (e) => {
		});
	}

	
}