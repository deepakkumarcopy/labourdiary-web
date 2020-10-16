import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
declare let braintree: any;
declare var $:any;
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})

export class PaymentComponent implements OnInit {

  item: any;
  orderId:any;
  totalAmount:any;
  serviceId:any;
  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {

    this.route.params.subscribe((params) => {
      if (!!params.serviceId && params.orderId && params.totalAmount) {
        this.serviceId = params.serviceId;
        this.orderId = params.orderId;
        this.totalAmount = params.totalAmount;
      }
    });
    this.api.getClientToken().subscribe((res) => {
      if(res.success) {
        this.callBrainTree(res.clientToken)
      }
    })
  }
  // payment() {
  // }
  callBrainTree(clientToken) {
    let self = this;
    var button = document.querySelector('#submit-button');
  
    braintree.dropin.create({
      authorization: clientToken,
      selector: "#dropin-container"
    }, function (err, instance) {
      $('#pay').click(function() {
        instance.requestPaymentMethod(function (err, payload) {
          let data = {
            amount: self.totalAmount,
            paymentMethodNonce: payload.nonce,
            serviceId: self.serviceId,
            orderId: self.orderId
          }
          self.api.checkout(data).subscribe((res) => {
            self.router.navigate(['/'])
            self.toastr.success('Payment successfully!')
          },(e) => {
            self.toastr.error('Some thing went wrong!')

            // self.common.stopLoader();
          });
        });
      });
    });
  }
}