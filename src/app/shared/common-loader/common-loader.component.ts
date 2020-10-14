import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';

@Component({
	selector: 'app-common-loader',
	templateUrl: './common-loader.component.html',
	styleUrls: ['./common-loader.component.scss']
})

export class CommonLoaderComponent implements OnInit {

	isLoading = false;

	constructor(private eventService: EventService) {
		this.eventService.showLoader$.subscribe(isLoading => {
			this.isLoading = isLoading;
		});
	}

	ngOnInit(): void {
	}
}