import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ModalService } from '../../../services/modal.service';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-work-information',
  templateUrl: './work-information.component.html',
  styleUrls: ['./work-information.component.scss']
})
export class WorkInformationComponent implements OnInit {
	workInformationForm:any;
  constructor(private modalService: ModalService,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
  	this.setWorkInformationForm()
  }
  setWorkInformationForm() {
    this.workInformationForm = new FormGroup({
      location: new FormControl ('', [Validators.required]),
      category: new FormControl('',  [Validators.required]),
      subCategory: new FormControl ('', [Validators.required]),
      fee: new FormControl('',  [Validators.required]),
      englishLevel: new FormControl ('', [Validators.required]),
      employeType: new FormControl ('', [Validators.required]),
      about: new FormControl ('', [Validators.required]),
      photo: new FormControl ('', [Validators.required]),
    });
  }
  savedWorkInformation(){
    this.router.navigate(['service-provider/business-information']);

  }
}
