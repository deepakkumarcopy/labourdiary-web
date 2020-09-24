import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { CommonService } from '../../services/common.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

	user: any = JSON.parse(localStorage.getItem('user'));
	userImage: any = this.user ? this.user.imageUrl : null;

	constructor(
		private modalService: ModalService,
		private common: CommonService,
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

	logout(id) {
		this.modalService.close(id);
		localStorage.clear();
		this.user = null;
		this.userImage = null;
	}
}