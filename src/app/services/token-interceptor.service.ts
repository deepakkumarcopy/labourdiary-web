import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})

export class TokenInterceptorService implements HttpInterceptor {

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		let clonedRequest: any;
		let token: any = JSON.parse(localStorage.getItem('token'));
		if (!!token) {
			clonedRequest = req.clone({
				headers: req.headers.set('Authorization', token)
			});
		} else {
			clonedRequest = req.clone({
				headers: req.headers.set('Accept', 'application/json')
			});
		}
		return next.handle(clonedRequest);
	}
}