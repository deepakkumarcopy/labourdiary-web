import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-private-information',
  templateUrl: './private-information.component.html',
  styleUrls: ['./private-information.component.scss']
})
export class PrivateInformationComponent implements OnInit {
  privateInformationForm:any;
  constructor() { }

  ngOnInit(): void {
    this.setWidthDrawForm();
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
  savePrivateInformation() {
    console.log(this.privateInformationForm)
  }
}
