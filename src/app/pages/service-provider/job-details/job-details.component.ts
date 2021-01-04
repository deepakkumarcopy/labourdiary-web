import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ModalService } from '../../../services/modal.service';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { CustomValidationService } from '../../../services/custom-validation.service';
import { ToastrService } from 'ngx-toastr';
import { ImageCroppedEvent } from 'ngx-image-cropper';
declare var $: any;
import { Select2OptionData } from 'ng-select2';
declare var jQuery: any;
@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent implements OnInit {
  isLoading:boolean = true
  order:any
  constructor(private modalService: ModalService,
		private api: ApiService,
		private route: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService,
		private customValidation: CustomValidationService) { }

  ngOnInit(): void {
    // this.getTimeSlot()
    this.route.params.subscribe((params) => {
      console.log(params,'paramssssssssssssssss')
			if (!!params && params.jobId) {
				this.getOrderDetails(params.jobId)
			}
		})
  }
  openModal(id) {
    this.modalService.open(id)
  }
  closeModal(id) {
    this.modalService.close(id)
  }
  getOrderDetails(id) {
    this.api.getOrder(id).subscribe((res) => { 
      console.log(res, 'response of job details')
      if(res.success) {
        this.isLoading = false;
        this.order = res.order[0]
        if(this.order){
          this.getTimeSlot(this.order.service.id)
        }
      }   else {
        this.isLoading = false
      }
    },err=>{
        this.isLoading = false;
        console.log('something went wrong')
    });

    
  }
  getTimeSlot(id) {
    this.api.getTimeSlots(id).subscribe((res) => {
      console.log(res, 'responseeeeeeeeeeeeeeeeeeeeeeeeeeee')
      if (res.success) {
        // this.isLoading = false;
       
      } else {
        // this.isLoading =false
      }
    },err=>{
        // this.isLoading = false;
        console.log('something went wrong')
    });
  }
}
