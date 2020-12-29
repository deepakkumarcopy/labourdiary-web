import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ModalService } from '../../../services/modal.service';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { CustomValidationService } from '../../../services/custom-validation.service';
import { ToastrService } from 'ngx-toastr';
import { ImageCroppedEvent } from 'ngx-image-cropper';
declare var $: any;
import { Select2OptionData } from 'ng-select2';
declare var jQuery: any;

@Component({
	selector: 'app-private-information',
	templateUrl: './private-information.component.html',
	styleUrls: ['./private-information.component.scss']
})

export class PrivateInformationComponent implements OnInit {

	privateInformationForm: any;
	addAddressForm: any;
	selectedCountry: any;
	countryDialCode: any = "0";
	userAddresses: any = [];
	imagePreview: any;
	user: any = JSON.parse(localStorage.getItem('user'));
	imageChangedEvent: any = '';
	croppedImage: any = '';
	isReadyToCrop: boolean = false;
	cropped: boolean = false;
	isEdit: any;
	UploadDocuments: any;
	languages: Array<Select2OptionData> = [];
	options: any;

	constructor(
		private modalService: ModalService,
		private api: ApiService,
		private route: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService,
		private customValidation: CustomValidationService
	) { }

	ngOnInit(): void {
		console.log(this.user)
		this.route.params.subscribe((params) => {
			if (!!params.source && params.source == 'edit-profile') {
				this.isEdit = params.source;
			}
		});
		this.setWidthDrawForm();
		this.setAddressForm();
		this.getAddress();

		this.countryDialCode = this.user.profile.countryCode ? this.user.profile.countryCode : "0"

		this.languages = this.api.formatLanguageList(['English (EN)', 'French (FR)', 'Deutsch (DE)', 'Dutch (NL)']);

		this.options = {
			width: '420',
			multiple: true,
			templateResult: this.templateResult,
		};
	}

	setWidthDrawForm() {

		this.privateInformationForm = new FormGroup({
			dob: new FormControl(this.user.profile.dob !== '0' ? this.user.profile.dob : '', [Validators.required]),
			email: new FormControl(this.user.email ? this.user.email : '', [Validators.required]),
			phone: new FormControl(this.user.profile.phone ? this.user.profile.phone : '', [Validators.required, Validators.minLength(4), Validators.maxLength(14), Validators.pattern('^[0-9]*$')]),
			language: new FormControl(this.user.profile.spokenLanguages ? this.user.profile.spokenLanguages : '', [Validators.required]),
			idProof: new FormControl(''),
			address: new FormControl('', [Validators.required]),
			education: new FormControl(this.user.profile.education ? this.user.profile.education : '', [Validators.required]),
			gender: new FormControl(this.user.profile.gender ? this.user.profile.gender : '', [Validators.required]),
			facebook: new FormControl(this.user.profile.facebook ? this.user.profile.facebook : ''),
			linkedIn: new FormControl(this.user.profile.linkedin ? this.user.profile.linkedin : '')
		});
	}

	setAddressForm() {
		this.addAddressForm = new FormGroup({
			buildingName: new FormControl('', [Validators.required]),
			area: new FormControl('', [Validators.required]),
			state: new FormControl('', [Validators.required]),
			city: new FormControl('', [Validators.required]),
			pincode: new FormControl('', [Validators.required]),
			addressType: new FormControl('Home', [Validators.required]),
		});
	}

	savePrivateInformation() {
		const form = new FormData();
		form.append('user', this.user.id);
		form.append('gender', this.privateInformationForm.value.gender);
		form.append('dob', this.privateInformationForm.value.dob);
		form.append('countryCode', this.countryDialCode);
		form.append('phone', this.privateInformationForm.value.phone);
		form.append('education', this.privateInformationForm.value.education);
		form.append('linkedin', this.privateInformationForm.value.linkedIn);
		form.append('facebook', this.privateInformationForm.value.facebook);
		for (const language of this.privateInformationForm.value.language) {
			form.append('spokenLanguages[]', language);
		}
		form.append('documents', this.UploadDocuments);
		console.log(this.privateInformationForm);
		this.api.updateProfile(form).subscribe((res) => {
			console.log(res, 'get searched service')
			if (res.success) {
				this.toastr.success(res.message);
				this.user.profile = res.profile;
				localStorage.setItem('user', JSON.stringify(this.user));
				if (this.isEdit == 'edit-profile') {
					this.router.navigate(['/profile']);
				} else {
					this.router.navigate(['/emergency-contact']);
				}
			} else {
				this.toastr.info(res.message);
			}
		}, (e) => {
			this.toastr.error('Something went wrong');
			console.log('error')
		});

	}

	public templateResult = (state: Select2OptionData): any => {
		return jQuery('<span>' + state.text + '</span>');
	}

	closeModal(id: string) {
		this.modalService.close(id);
	}

	openModal(id: string) {
		this.modalService.open(id);
		if (id == 'user-address') {
			this.addAddressForm.value = {}
			this.closeModal('add-new-address');
		}
		if (id = 'add-new-address') {
			this.getAddress()
		}
	}

	createAddress() {
		this.userAddresses.push(this.addAddressForm.value)
		console.log(this.addAddressForm.value);
		let data = {
			user: this.user.id,
			houseNo: this.addAddressForm.value.buildingName,
			address: this.addAddressForm.value.area,
			city: this.addAddressForm.value.city,
			state: this.addAddressForm.value.state,
			pincode: this.addAddressForm.value.pincode,
			addressType: this.addAddressForm.value.addressType
		}
		this.api.createAddress(data).subscribe((res) => {
			console.log(res, 'get searched service')
			if (res.success) {
				this.toastr.success(res.message);
				this.getAddress();
				this.openModal('add-new-address');
				this.closeModal('user-address');
			} else {
				this.toastr.info(res.message);
			}
		}, (e) => {
			this.toastr.error('Something went wrong');
			console.log('error')
		});
	}

	address() {
		this.closeModal('add-new-address');
	}

	resetPhoneNumber(e) {
		this.selectedCountry = e.name;
		this.countryDialCode = e.countryCode;
	}

	onSelectFile(event) {
		console.log('evventtttttttt', event)
		if (event.target.files && event.target.files[0]) {
			var reader = new FileReader();

			reader.readAsDataURL(event.target.files[0]); // read file as data url

			reader.onload = (event) => { // called once readAsDataURL is completed
				this.imagePreview = event.target.result;
				console.log(this.imagePreview, 'image previewwwwwww')
			}
			this.UploadDocuments = event.target.files[0];
			console.log(this.privateInformationForm.value.idProof, 'id prooffffffff')
		}
	}

	getAddress() {
		this.api.getAddress(this.user.id).subscribe((res) => {
			console.log(res, 'get searched service')
			if (res.success) {
				this.userAddresses = res.addresses;
				if (!!this.userAddresses) {
					const fltAddress = this.userAddresses.find(add => add.selected === true);
					if (!!fltAddress) {
						const address = fltAddress.houseNo + ' ' + ' ' + fltAddress.address + ' ' + fltAddress.city + ' ' + fltAddress.state + ' ' + fltAddress.pincode
						this.privateInformationForm.get('address').setValue(address);
					}
				}
			} else {
				this.userAddresses = [];
			}
		}, (e) => {
			this.toastr.error('Something went wrong');
			console.log('error')
		});
	}

	getSelectedAddress(address) {
		if (this.userAddresses && this.userAddresses.length > 0) {
			this.userAddresses.forEach((add) => {
				add.selected = (add.id == address);
			});
		}
	}

	saveAddress() {
		const fltAddress = this.userAddresses.find(add => add.selected === true);
		console.log(fltAddress, 'fltAddress')
		if (!!fltAddress) {
			let data = {
				selected: true,
				addressId: fltAddress.id,
				user: this.user.id
			}
			this.api.updateAddress(data).subscribe((res) => {
				console.log(res, 'get searched servicesssssssssssssss')
				if (res.success) {
					this.closeModal('add-new-address');
					const address = fltAddress.houseNo + ' ' + ' ' + fltAddress.address + ' ' + fltAddress.city + ' ' + fltAddress.state + ' ' + fltAddress.pincode
					this.privateInformationForm.get('address').setValue(address);
				}
			}, (e) => {
				this.toastr.error('Something went wrong');
				console.log('error')
			});
		}
	}

	fileChangeEvent(event: any): void {
		this.imageChangedEvent = event;
		this.cropped = false;
		this.openModal('update-photo')
		this.isReadyToCrop = true;
		console.log('fbhjbfhjervjh')
	}

	imageCropped(event: ImageCroppedEvent) {
		this.croppedImage = event.base64;
		console.log('imageee')
	}

	imageLoaded() {
		console.log('imageLoaded')
		// show cropper
	}

	cropperReady() {
		console.log('cropperReady')
		// cropper ready
	}

	loadImageFailed() {
		// show message
	}

	cropImage() {
		const imageName = 'name.png';
		const imageBlob = this.dataURItoBlob(this.croppedImage);
		const imageFile = new File([imageBlob], imageName, { type: 'image/jpeg' });
		console.log(imageFile, 'image filee')
		console.log(this.croppedImage)
		let data = {
			id: this.user.id,
			files: imageFile,
		}
		this.api.imageUpload(data).subscribe((res) => {
			console.log(res, 'image uploadddddddddddd')
			if (res.success) {
				this.toastr.success('Successfully Updated');
				this.user.imageUrl = res.user.imageUrl
				localStorage.setItem('user', JSON.stringify(this.user));
				this.closeModal('update-photo');
			} else {
				this.toastr.info(res.message);
			}
		}, (e) => {
			this.toastr.error('Something went wrong');
			console.log('error')
		});
	}

	dataURItoBlob(dataURI) {
		var byteString;
		if (dataURI.split(',')[0].indexOf('base64') >= 0)
			byteString = atob(dataURI.split(',')[1]);
		else
			byteString = unescape(dataURI.split(',')[1]);

		// separate out the mime component
		var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

		// write the bytes of the string to a typed array
		var ia = new Uint8Array(byteString.length);
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		return new Blob([ia], { type: mimeString });
	}

	numberOnly(e) {
		this.customValidation.preventFromAlphabet(e)
	}
}
