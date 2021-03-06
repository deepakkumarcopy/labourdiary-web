// Component
import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

// Services
import { ModalService } from '../../../services/modal.service';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { ChangeDetectorRef } from '@angular/core';
declare var $:any;
@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
	@Output() valueChange = new EventEmitter();

	user: any = JSON.parse(localStorage.getItem('user'));
	userImage: any = this.user ? this.user.imageUrl : null;
	resentServices: any = [];
	categories: any = [];
	savedServiceList: any = [];
	windowEvent:any;
	isDown:any;
	isLoadingForCategory:boolean = true;
	isLoadingForService:boolean = true;
	constructor(
		private route: Router,
		private api: ApiService,
		private common: CommonService,
		private modalService: ModalService,
		private toastr: ToastrService,
		private cdr: ChangeDetectorRef
	) {
	}

	ngOnInit(): void {
		let self = this;
		$(document).scroll(function() {
       		if($(window).scrollTop() > 50){
				self.windowEvent = 'down'

	       }else if($(window).scrollTop() < 50){
	       		self.windowEvent = 'top'

	       }
      	});
		if (this.user) {
			this.api.getListOfSavedServicesByUserId(this.user.id).subscribe((res) => {
				if (res.success) {
					this.savedServiceList = res.savedServiceList;
				}
			});
		}

			this.api.getTopCategories().subscribe((res) => {
				if (res.success) {
					this.isLoadingForCategory = false;
					console.log(res)
					this.categories = res.category;
				} else {
					this.isLoadingForCategory = false;
				}
			});

			this.api.getRecentServices({ cityName: 'kanpur' }).subscribe((res) => {
				if (!!res.success) {
					this.resentServices = res.services;
					this.isLoadingForService = false;
				} else {
					this.isLoadingForService = false;
				}
				console.log(res)
			}, (error) => {
				this.isLoadingForService = false;
			});
	}

	checkSavedService(id: string) {
		return this.savedServiceList.find((item: any) => item == id);
	}

	selectCategory(category: any) {
		// this.route.navigate(['search', {state: { item : category}}]);
		console.log(category)
	}

	selectService(service) {
		console.log('yes')
	}

	saveServiceProvider(service) {
		let data = {
			serviceId: service.id,
			createdByUserId: this.user.id,
			user: service.user.id
		}
		this.savedServiceList.push(service.id)
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

	openModal(id) {
		this.modalService.open(id)
	}

	closeModal(id) {
		this.modalService.close(id);
	}

	// logout(id) {
	// 	this.modalService.close(id);
	// 	localStorage.clear();
	// 	this.toastr.success('Sucessfully logout!')
	// 	this.user = null;
	// 	this.userImage = null;
	// }
}