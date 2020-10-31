import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ModalService } from '../../../services/modal.service';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
declare var jQuery:any;

@Component({
  selector: 'app-business-information',
  templateUrl: './business-information.component.html',
  styleUrls: ['./business-information.component.scss']
})
export class BusinessInformationComponent implements OnInit {
  businessInfoForm:any;
  selectedCountry: any;
  countryDialCode: any = "0";
  constructor(private modalService: ModalService,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.setBusinessInfoForm()
  }
  setBusinessInfoForm() {
    this.businessInfoForm = new FormGroup({
      name: new FormControl ('', [Validators.required]),
      email: new FormControl('',  [Validators.required]),
      phone: new FormControl ('', [Validators.required]),
      address: new FormControl('',  [Validators.required]),
      link: new FormControl ('', [Validators.required]),
      companyNumber: new FormControl ('', [Validators.required]),
    });
  }
  resetPhoneNumber(e) {
    this.selectedCountry = e.name;
    this.countryDialCode = e.countryCode;
  }
  savedBusinessInfo(){

  }
}
