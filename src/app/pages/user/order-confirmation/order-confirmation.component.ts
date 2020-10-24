import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss']
})
export class OrderConfirmationComponent implements OnInit {
  service: any;
  appointmentDate: any;
  serviceCharge: number;
  totalAmount: number;
  serviceUserId: any;
  userProfile: any;
  user: any = JSON.parse(localStorage.getItem('user'));

  constructor(private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (!!params.serviceId && params.reserveDate) {
        this.appointmentDate = new Date(params.reserveDate);
        this.getService(params.serviceId);
      }
    });
  }

  getService(id) {
    this.api.getService(id).subscribe((res) => {
      if (!!res.success) {
        this.service = res.services[0];
        this.serviceCharge = (this.service.price * 6)/100;
        this.totalAmount = this.serviceCharge + Number(this.service.price);
        if (!!this.service.user) {
          this.serviceUserId = this.service.user.id;
          this.getUserProfile();
        }
      }
    }, error => {
      console.log(error);
    });
  }

  getUserProfile() {
    this.api.getUserProfile(this.serviceUserId).subscribe((res) => {
      if (!!res.success) {
        this.userProfile = res.profile[0];
      }
    }, error => {
      console.log(error);
    });
  }

  proceedToPayment() {
    const data = {
      discount: '12',
      itemTotal: this.service.price,
      serviceCharge: this.serviceCharge,
      appointmentTime: this.appointmentDate,
      totalAmount: this.totalAmount,
      user: this.user.id,
      service: this.service.id,
      serviceUserId: this.serviceUserId,
      address:"5f856c4278216a4f3cfa47d8"
    };
    this.api.createOrder(data).subscribe((res: any) => {
      console.log(res);
      if (res.success) {
        this.router.navigate(['user/payment', res.order.service, res.order.id, res.order.totalAmount]);
        // this.getClientToken(res.order);
        // this.order = res.order;
      } else {
        this.toastr.info(res.message);
      }
    }, (e) => {
        this.toastr.info('Something went wrong');
        
    });
  }
}
