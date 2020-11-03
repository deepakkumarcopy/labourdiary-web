import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ModalService } from '../../../services/modal.service';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
declare var jQuery:any;

// import { NgSelect2Module } from 'ng-select2';
// import { NgSelect2Module } from 'ng-select2';
@Component({
  selector: 'app-emergency-contact',
  templateUrl: './emergency-contact.component.html',
  styleUrls: ['./emergency-contact.component.scss']
})
export class EmergencyContactComponent implements OnInit {
  emergencyContactForm:any;
  selectedCountry: any;
  countryDialCode: any = "0";
  providerStage:any = 'emergency-contact'
  constructor(private modalService: ModalService,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.setEmergencyContactForm();
  }

  resetPhoneNumber(e) {
    this.selectedCountry = e.name;
    this.countryDialCode = e.countryCode;
  }

  setEmergencyContactForm() {
    this.emergencyContactForm = new FormGroup({
      name: new FormControl ('', [Validators.required]),
      email: new FormControl('',  [Validators.required]),
      phone: new FormControl ('', [Validators.required]),
      code: new FormControl('',  [Validators.required]),
      relation: new FormControl ('', [Validators.required]),
    });
  }
  savedEmergencyContact() {
    this.router.navigate(['service-provider/work-information']);
  }
}
