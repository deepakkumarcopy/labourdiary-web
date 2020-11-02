import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ModalService } from '../../../services/modal.service';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';

declare var $:any;
@Component({
  selector: 'app-private-information',
  templateUrl: './private-information.component.html',
  styleUrls: ['./private-information.component.scss']
})
export class PrivateInformationComponent implements OnInit {
  privateInformationForm:any;
  addAddressForm:any;
  selectedCountry: any;
  countryDialCode: any = "0";
  userAddresses:any=[];
  imagePreview:any;
  user: any = JSON.parse(localStorage.getItem('user'));
  constructor(private modalService: ModalService,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.setWidthDrawForm();
    this.setAddressForm();
    this.getAddress();
    
  }
  setWidthDrawForm() {
    this.privateInformationForm = new FormGroup({
      dob: new FormControl ('', [Validators.required]),
      email: new FormControl(this.user.email,  [Validators.required]),
      phone: new FormControl ('', [Validators.required]),
      language: new FormControl('',  [Validators.required]),
      idProof: new FormControl ('', [Validators.required]),
      address: new FormControl('',  [Validators.required]),
      education: new FormControl('',  [Validators.required]),
      gender: new FormControl('',  [Validators.required]),
      facebook: new FormControl(''),
      linkedIn: new FormControl('')
    });
  }
  setAddressForm() {
    this.addAddressForm = new FormGroup({
      buildingName: new FormControl ('', [Validators.required]),
      area: new FormControl('',  [Validators.required]),
      state: new FormControl ('', [Validators.required]),
      city: new FormControl('',  [Validators.required]),
      pincode: new FormControl ('', [Validators.required]),
      addressType: new FormControl('',[Validators.required]),
    });
  }
  savePrivateInformation() {
    const form = new FormData();

    form.append('user', this.user.id);
    form.append('gender', this.privateInformationForm.value.gender);
    form.append('dob', this.privateInformationForm.value.dob);
    form.append('countryCode', this.countryDialCode);
    form.append('phone', this.privateInformationForm.value.phone);
    form.append('education', this.privateInformationForm.value.higherEducation);
    form.append('linkedin', this.privateInformationForm.value.linkedIn);
    form.append('facebook', this.privateInformationForm.value.facebook);
    for (const language of this.privateInformationForm.value.language) {
      form.append('spokenLanguages[]', language);
    }
    form.append('documents', this.privateInformationForm.value.idProof);
    console.log(this.privateInformationForm);
    this.api.updateProfile(form).subscribe((res) => {
      console.log(res, 'get searched service')
      if (res.success) {
        this.toastr.success(res.message);
      } else {
        this.toastr.info(res.message);
      }
      }, (e) => {
        this.toastr.error('Something went wrong');
        console.log('error')
    });

    // this.router.navigate(['service-provider/emergency-contact']);
  }
  
  closeModal(id: string) {
    this.modalService.close(id);
  }

  openModal(id: string) {
    this.modalService.open(id);
    if(id == 'user-address') {
      this.addAddressForm.value= {}
      this.closeModal('add-new-address');
    }
    if (id = 'add-new-address') {
      this.getAddress()
    }
  } 
  createAddress() {
    this.userAddresses.push(this.addAddressForm.value)
    console.log(this.addAddressForm.value);
    this.api.createAddress(this.addAddressForm.value).subscribe((res) => {
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
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.imagePreview = event.target.result;
      }
    }
  }

  getAddress() {
    this.api.getAddress(this.user.id).subscribe((res) => {
      console.log(res, 'get searched service')
      if (res.success) {
        this.userAddresses = res.addresses;
      } else {
        this.userAddresses = [];
      }
      }, (e) => {
        this.toastr.error('Something went wrong');
        console.log('error')
    });
  }
  selectedAddress(address) {
    if (this.userAddresses && this.userAddresses.length>0) {
      this.userAddresses.forEach((add) => {
        add.selected = (add.id == address);
      });
    }
  }
  saveAddress() {
    const fltAddress = this.userAddresses.find(add => add.selected === true);
    this.closeModal('add-new-address');
    const address = fltAddress.houseNo + ' ' +  ' ' + fltAddress.address + ' ' +  fltAddress.city  + ' ' + fltAddress.state + ' ' + fltAddress.pincode
    this.privateInformationForm.get('address').setValue(address);
  }
}