import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})

export class EventService {

	constructor() { }

	private showLoaderEvent = new Subject<boolean>();
	showLoader$ = this.showLoaderEvent.asObservable();

	showLoader(isLoading: boolean) {
		this.showLoaderEvent.next(isLoading);
	}
}
