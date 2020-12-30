import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  user: any = JSON.parse(localStorage.getItem('user'));
  page_num: any = 10;
  page_size: any = 0;
  order: any = [];
  isLoading:boolean = true;
  selectedDate:any;
  constructor(private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      console.log(params,'paramssssssssssssssss')
			if (!!params && params.orderId) {
				this.getOrderDetails(params.orderId)
			}
		})
  }
  getOrderDetails(id) {
    this.api.getOrder(id).subscribe((res) => { 
      if(res.success) {
        this.isLoading = false;
        this.order = res.order[0]
      }   else {
        this.isLoading = false
      }
    },err=>{
        this.isLoading = false;
        console.log('something went wrong')
    });

    
  }
  acceptOrRejectReschedule(status: string) {
    if (status == 'USER_RESCHEDULE' && !this.selectedDate) {
      return
    }
		let data = {
			orderId: this.order.id,
			orderStatus: status,
			rescheduleAppointmentTime: status == 'USER_RESCHEDULE' ? this.selectedDate : this.order.rescheduleAppointmentTime,
			appointmentTime:  status == 'USER_RESCHEDULE' ? this.order.appointmentTime : this.order.rescheduleAppointmentTime
		}
		this.api.rescheduleAppointment(data).subscribe((res) => {
			if (res.success) {
        this.isLoading = false;
        this.router.navigate(['user/orders'])
        // this.toastr.success(res.message)
			} else {
        this.isLoading = false;
        this.toastr.info(res.message);
      }
		}, (e) => {
        this.isLoading = false;
			console.log(e)
		});
	}
  parseDate(dateString: string) {

		console.log(new Date(dateString))
	    if (dateString) {
	        this.selectedDate = dateString
	        console.log(this.selectedDate, 'selectedDate')
	    }
    // return null;
	}

}
