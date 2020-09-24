import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';

import { throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

@Injectable({
	providedIn: 'root'
})

export class ApiService {

	baseUrl = environment.baseUrl;

	constructor(
		private http: HttpClient,
	) { }
}
