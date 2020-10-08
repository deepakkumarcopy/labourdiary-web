import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { CommonService } from '../../../services/common.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

	user: any = JSON.parse(localStorage.getItem('user'));
	userImage: any = this.user ? this.user.imageUrl : null;
	isDropdown:boolean = false;
	constructor(
		private common: CommonService,
		private modalService: ModalService,
	) {
		this.common.subscribeData().subscribe(res => {
			if (!!res.login) {
				this.user = res.login;
				this.userImage = res.login.imageUrl;
			}
		});
	}

	ngOnInit(): void {
	}

	openModal(id) {
		this.modalService.open(id)
	}

	closeModal(id) {
		this.modalService.close(id);
	}
	suggestionDropdown() {
		console.log('ddddd')
		this.isDropdown = true;
	}
}
