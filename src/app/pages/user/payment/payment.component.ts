import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
declare let braintree: any;

@Component({
	selector: 'app-payment',
	templateUrl: './payment.component.html',
	styleUrls: ['./payment.component.scss']
})

export class PaymentComponent implements OnInit {

	item: any;

	constructor(
		private api: ApiService,
	) { }

	ngOnInit(): void {
		this.api.getClientToken().subscribe((res) => {
			if(res.success) {
				this.callBrainTree(res.clientToken)
			}
		})
	}
	
	callBrainTree(clientToken) {
		let self = this;
		var button = document.querySelector('#submit-button');
	
		braintree.dropin.create({
			authorization: clientToken,
			selector: "#dropin-container"
		}, function (err, instance) {
			button.addEventListener('click', function () {
				instance.requestPaymentMethod(function (err, payload) {
					let data = {
						amount: self.item.order.totalAmount,
						paymentMethodNonce: payload.nonce,
						serviceId: self.item.service.id,
						orderId: self.item.order.id
					}
					self.api.checkout(data).subscribe((res) => {
						// self.common.stopLoader();
						// self.navCtrl.navigateForward('thankyou');
					},(e) => {
						// self.common.stopLoader();
					})
				});
			})
		});
	}
}