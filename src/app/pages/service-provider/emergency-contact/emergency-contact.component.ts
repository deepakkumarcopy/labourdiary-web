import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ModalService } from '../../../services/modal.service';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { ToastrService } from 'ngx-toastr';
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
  user: any = JSON.parse(localStorage.getItem('user'));
  constructor(private modalService: ModalService,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
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
      relation: new FormControl ('', [Validators.required]),
    });
  }
  savedEmergencyContact() {
    let data = {
      name: this.emergencyContactForm.value.name,
      relation: this.emergencyContactForm.value.relation,
      email: this.emergencyContactForm.value.email,
      countryCode: this.countryDialCode,
      phone: this.emergencyContactForm.value.phone,
      user: this.user.id
    }
    this.api.emergencyContact(data).subscribe((res) => {
      console.log(res, 'get searched service')
      if (res.success) {
        this.toastr.success(res.message);
        this.router.navigate(['service-provider/work-information']);
      } else {
        this.toastr.info(res.message);
      }
      }, (e) => {
        this.toastr.error('Something went wrong');
        console.log('error')
    });
  }
}
