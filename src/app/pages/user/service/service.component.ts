import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
	selector: 'app-service',
	templateUrl: './service.component.html',
	styleUrls: ['./service.component.scss']
})

export class ServiceComponent implements OnInit {

	service: any;

	constructor(
		private api: ApiService,
		private route: ActivatedRoute,
	) { }

	ngOnInit(): void {
		this.route.params.subscribe((params) => {
			this.api.getService(params.id).subscribe((res) => {
				if(res.success) {
					this.service = res.services[0];
					console.log(res)
				}
			})
		})
	}
}