import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ApiService } from '../../../services/api.service';
declare var $:any;
@Component({
	selector: 'app-service',
	templateUrl: './service.component.html',
	styleUrls: ['./service.component.scss']
})

export class ServiceComponent implements OnInit {

	service: any;
	userBusinessInfo: any;
	userComments: any;
	userProfile: any;
	savedServiceList = [];
	user: any = JSON.parse(localStorage.getItem('user'));
	selectedDate:any;
	serviceUserId:any;
	constructor(
		private api: ApiService,
		private route: ActivatedRoute,
		private router: Router
	) { }

	ngOnInit(): void {
		this.route.params.subscribe((params) => {
			if (!!params.id) {
				this.getService(params.id);
				this.getListOfSavedServicesByUserId();
			}
		})
	}

	getListOfSavedServicesByUserId() {
		this.api.getListOfSavedServicesByUserId(this.user.id).subscribe((res) => {
			if (res.success) {
				this.savedServiceList = res.savedServiceList;
			}
		});
	}

	getService(id) {
		this.api.getService(id).subscribe((res) => {
			if (!!res.success) {
				this.service = res.services[0];
				if(!!this.service.user) {
					this.serviceUserId = this.service.user.id
					this.getBusinessInfo()
					this.getUserComment();
					this.getUserProfile();
				}
				console.log(this.service, 'serviceeeeeeee')
			}
		}, error => {
			console.log(error)
		});
	}

	getBusinessInfo() {
		this.api.getbusinessInformation(this.service.user.id).subscribe((res) => {
			if (!!res.success) {
				this.userBusinessInfo = res.business;
			}
		}, error => {
			console.log(error)
		});
	}

	getUserProfile() {
		this.api.getUserProfile(this.serviceUserId).subscribe((res) => {
			if (!!res.success) {
				this.userProfile = res.profile[0];
			}
		}, error => {
			console.log(error)
		});
	}

	getUserComment() {
		this.api.getUserComments(this.serviceUserId).subscribe((res) => {
			if (!!res.success) {
				this.userComments = res.reviews;
			}
		}, error => {
			console.log(error)
		});
	}

	saveServiceProvider(service) {
		let data = {
			serviceId: service.id,
			createdByUserId: this.user.id,
			user: service.user.id
		}
		this.savedServiceList.push(service.id);
		this.api.saveService(data).subscribe((res) => {
			if (!res.success) {
				this.removeFromSaved(service.id);
			}
		}, (e) => {
			this.removeFromSaved(service.id);
		})
	}

	removeFromSaved(serviceId: string) {
		let index = this.savedServiceList.indexOf(serviceId);
		this.savedServiceList.splice(index, 1);
	}


	checkSavedService(id: string) {
		return this.savedServiceList.find((item: any) => item == id);
	}

	removeSavedServiceProvider(service: any) {
		this.removeFromSaved(service.id);
		this.api.getSavedServicesByService(service.id).subscribe((res) => {
			if (res.success) {
				this.api.deleteSaveServices(res.savedservices[0].id).subscribe((res) => {
					if (!res.success) {
						this.savedServiceList.push(service.id);
					}
				}, (e) => {
					this.savedServiceList.push(service.id);
				});
			} else {
				this.savedServiceList.push(service.id)
			}
		}, (e) => {
			this.savedServiceList.push(service.id)
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

	goToOrderConfirmation() {
		console.log(this.selectedDate)
      this.router.navigate(['order-confirmation',this.service.id,this.selectedDate]);

		// this.router.navigate(['order-confirmation',this.service.id,this.selectedDate])
	}
}