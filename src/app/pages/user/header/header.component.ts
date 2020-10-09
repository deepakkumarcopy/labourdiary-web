import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
declare var $:any;
@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

	user: any = JSON.parse(localStorage.getItem('user'));
	userImage: any = this.user ? this.user.imageUrl : null;
	isDropdown:boolean = false;
	categories:any;
	lacations:any = ['Kanpur','delhi','mumbai']
	showDatalist:boolean = false;
	selectedDate:any;
	selectedCategory:any;
	location:any;
	constructor(
		private common: CommonService,
		private modalService: ModalService,
		private api: ApiService,
	) {
		this.common.subscribeData().subscribe(res => {
			if (!!res.login) {
				this.user = res.login;
				this.userImage = res.login.imageUrl;
			}
		});
	}

	ngOnInit(): void {
		this.getCategory()
	}

	openModal(id) {
		this.modalService.open(id)
	}

	closeModal(id) {
		this.modalService.close(id);
	}
	
	getCategory() {
		this.api.getCategory().subscribe((res)=>{
			if(!!res.success) {
				this.categories = res.category
			}
		})
	}

	datepicker(){
		$('#date-picker-example').datepicker({
		  format: 'mm/dd',
		  autoclose: true
		});
	}
	

}
