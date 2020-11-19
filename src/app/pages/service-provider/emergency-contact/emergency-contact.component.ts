import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ModalService } from '../../../services/modal.service';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { ConfirmationDialogService } from '../../../services/confirmation-dialog.service';
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
  providerStage:any = 'emergency-contact'
  emergencyContact:any = []
  isUpdate:boolean = false;
  contactId:any;
  constructor(private modalService: ModalService,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private confirmationDialogService: ConfirmationDialogService
  ) { }

  ngOnInit(): void {
    this.setEmergencyContactForm();
    this.getEmergencyContact()
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
        this.router.navigate(['/work-information']);
      } else {
        this.toastr.info(res.message);
      }
      }, (e) => {
        this.toastr.error('Something went wrong');
        console.log('error')
    });
  }

  getEmergencyContact() {
    this.api.getEmergencyContact(this.user.id).subscribe((res) => {
      console.log(res, 'get searched service')
      if (res.success) {
        this.emergencyContact = res.emergency
        // this.toastr.success(res.message);
        
      } else {
        this.toastr.info(res.message);
      }
      }, (e) => {
        this.toastr.error('Something went wrong');
        console.log('error')
    });
  }

  editEmergencyContact(contact){
    this.contactId = contact.id
    this.getSelectedContact(contact)
    this.isUpdate =true;
    this.countryDialCode = contact.countryCode;

    this.emergencyContactForm = new FormGroup({
      name: new FormControl (contact.name, [Validators.required]),
      email: new FormControl(contact.email,  [Validators.required]),
      phone: new FormControl (contact.phone, [Validators.required]),
      relation: new FormControl (contact.relation, [Validators.required]),
    });
  }

  getSelectedContact(contact) {
    if (this.emergencyContact && this.emergencyContact.length>0) {
      this.emergencyContact.forEach((cont) => {
        cont.selected = (cont.id == contact.id);
      });
    }
  }

  updateEmergencyContact() {
    let data = {
      EmergencyInformationId: this.contactId,
      name: this.emergencyContactForm.value.name,
      relation: this.emergencyContactForm.value.relation,
      email: this.emergencyContactForm.value.email,
      countryCode: this.countryDialCode,
      phone: this.emergencyContactForm.value.phone,
      user: this.user.id
    }
    this.api.updateEmergencyContact(data).subscribe((res) => {
      console.log(res, 'get searched service')
      if (res.success) {
        this.toastr.success(res.message);
        this.router.navigate(['/work-information']);
      } else {
        this.toastr.info(res.message);
      }
      }, (e) => {
        this.toastr.error('Something went wrong');
        console.log('error')
    });
  }
  deleteEmergencyContact(contact) {
    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to ... ?')
    .then((confirmed) => {
      if(confirmed) {
        this.api.deleteEmergencyContact(contact.id).subscribe((res)=>{
        if(res.success){
          this.toastr.success(res.message);
          this.getEmergencyContact();
        } else {
          this.toastr.info(res.message);
        }
        }, (e)=>{
            this.toastr.error('Something went wrong');
        })
      }
    })
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }
}
