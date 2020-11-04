import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ModalService } from '../../../services/modal.service';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Select2OptionData } from 'ng-select2';
declare var jQuery:any;

@Component({
  selector: 'app-work-information',
  templateUrl: './work-information.component.html',
  styleUrls: ['./work-information.component.scss']
})
export class WorkInformationComponent implements OnInit {
	workInformationForm:any;
  categories:Array<Select2OptionData>;
  formattedCategoriesList:Array<Select2OptionData>;
  searchCategory:any = [];
  options:any;

  constructor(private modalService: ModalService,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
  	this.setWorkInformationForm();
    this.api.getCategory().subscribe((res) => {
      this.categories = res.category;
      this.formattedCategoriesList = this.api.formatCategoryList(res.category);
      console.log(this.categories, 'categories')
      this.searchCategory = res.category;
    });
    this.options = {
      width: '420',
      multiple: true,
      tags: true,
      templateResult: this.templateResult,
      templateSelection: this.templateSelection
    };
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
  public templateResult = (state: Select2OptionData): any => {
   
    return jQuery('<span>' + state.text +  '</span>');
  }

  // function for selection template
  public templateSelection =  (state: Select2OptionData): any => {
    
    return jQuery('<span>' + state.text + '</span>');
  }
  savedWorkInformation(){
    this.router.navigate(['service-provider/business-information']);

  }
}
