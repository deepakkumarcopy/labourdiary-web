import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})

export class CommonService {

	private fooSubject = new Subject<any>();

	constructor() { }

	publishData(data: any) {
		this.fooSubject.next(data);
	}

	subscribeData(): Subject<any> {
		return this.fooSubject;
	}

}
