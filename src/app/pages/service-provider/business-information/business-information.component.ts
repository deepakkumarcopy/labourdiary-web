import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ModalService } from '../../../services/modal.service';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { ToastrService } from 'ngx-toastr';
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
  user: any = JSON.parse(localStorage.getItem('user'));
  constructor(private modalService: ModalService,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.setBusinessInfoForm();
  }
  setBusinessInfoForm() {
    let EMAILPATTERN = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

    this.businessInfoForm = new FormGroup({
      name: new FormControl (''),
      email: new FormControl('', [Validators.pattern(EMAILPATTERN)]),
      phone: new FormControl (''),
      address: new FormControl(''),
      link: new FormControl (''),
      companyNumber: new FormControl (''),
    });
  }
  resetPhoneNumber(e) {
    this.selectedCountry = e.name;
    this.countryDialCode = e.countryCode;
  }
  savedBusinessInfo(){
    if (this.businessInfoForm.status == 'INVALID') {
      return;
    }

    let data = {
      companyName: this.businessInfoForm.value.name,
      companyAddress: this.businessInfoForm.value.address,
      countryCode: this.countryDialCode,
      companyContact: this.businessInfoForm.value.phone,
      enterprisesNumber: this.businessInfoForm.value.companyNumer,
      websiteLinks: this.businessInfoForm.value.link,
      email: this.businessInfoForm.value.email,
      user: this.user.id
    }

    this.api.businessInformation(data).subscribe((res) => {
      console.log(res, 'get searched service')
      if (res.success) {
        this.user.businessInformation = res.business;
        localStorage.setItem('user', JSON.stringify(this.user));
        this.toastr.success("Succefully Updated");
        this.router.navigate(['/']);
      } else {
        this.toastr.info(res.message);
      }
      }, (e) => {
        this.toastr.error('Something went wrong');
        console.log('error')
    });
  }
}
