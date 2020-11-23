// Component
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

// Services
import { ModalService } from '../../../services/modal.service';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
declare var $:any;
@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

	user: any = JSON.parse(localStorage.getItem('user'));
	userImage: any = this.user ? this.user.imageUrl : null;
	resentServices: any = [];
	categories: any = [];
	savedServiceList: any = [];
	windowEvent:any;
	isDown:any;
	constructor(
		private route: Router,
		private api: ApiService,
		private common: CommonService,
		private modalService: ModalService,
		private toastr: ToastrService
	) {
	}

	ngOnInit(): void {
		$(document).scroll(function() {
       		if($(window).scrollTop() > 50){
			console.log('toppppppppppppppppppppppppp')
			this.windowEvent = 'down'
	        // $("#headerline").css("background","red");
	        // $("#header").hide();
	        // $("#header2").show();

	       }else if($(window).scrollTop() < 50){
	       	this.windowEvent = 'top'
	       	console.log('ddddddddddddddddd')
	        // $("#headerline").css("background","blue");
	        // $("#header2").hide();
	        // $("#header").show();

	       }
      	});
		if (this.user) {
			this.api.getListOfSavedServicesByUserId(this.user.id).subscribe((res) => {
				if (res.success) {
					this.savedServiceList = res.savedServiceList;
				}
			});

			this.api.getTopCategories().subscribe((res) => {
				if (res.success) {
					console.log(res)
					this.categories = res.category;
				} else {
				}
			});

			this.api.getRecentServices({ cityName: 'kanpur' }).subscribe((res) => {
				if (!!res.success) {
					this.resentServices = res.services;
				}
				console.log(res)
			}, (error) => {
			});
		}
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

	logout(id) {
		this.modalService.close(id);
		localStorage.clear();
		this.toastr.success('Sucessfully logout!')
		this.user = null;
		this.userImage = null;
	}
}