import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';

@Component({
	selector: 'app-service-header',
	templateUrl: './service-header.component.html',
	styleUrls: ['./service-header.component.scss']
})

export class ServiceHeaderComponent implements OnInit {

	user: any = JSON.parse(localStorage.getItem('user'));
	userImage: any = this.user ? this.user.imageUrl : null;

	constructor(
		private router: Router,
		private route: ActivatedRoute
	) { }

	ngOnInit(): void {
	}

}