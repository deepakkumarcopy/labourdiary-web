import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ModalService } from '../../../services/modal.service';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ApiService } from '../../../services/api.service';

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
  constructor(private modalService: ModalService,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.setWidthDrawForm();
    this.setAddressForm();
  }
  setWidthDrawForm() {
    this.privateInformationForm = new FormGroup({
      dob: new FormControl ('', [Validators.required]),
      email: new FormControl('',  [Validators.required]),
      phone: new FormControl ('', [Validators.required]),
      language: new FormControl('',  [Validators.required]),
      idProof: new FormControl ('', [Validators.required]),
      address: new FormControl('',  [Validators.required]),
      education: new FormControl('',  [Validators.required]),
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
    console.log(this.privateInformationForm);
    this.router.navigate(['service-provider/emergency-contact']);
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
  } 
  addAddress() {
    this.userAddresses.push(this.addAddressForm.value)
    console.log(this.addAddressForm.value);
    this.closeModal('user-address');
    this.openModal('add-new-address');
  }
  address() {
    this.closeModal('add-new-address');
  }
  resetPhoneNumber(e) {
    this.selectedCountry = e.name;
    this.countryDialCode = e.countryCode;
  }
}
