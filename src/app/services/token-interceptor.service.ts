import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { EventService } from './event.service';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})

export class TokenInterceptorService implements HttpInterceptor {
	constructor(public eventService: EventService) {}
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
		this.setLoader(clonedRequest);
		return next.handle(clonedRequest).pipe(map((event: HttpEvent<any>) => {
			if(event["status"] == 200){
      	this.eventService.showLoader(false);
			}
      return event;
    }),
    catchError((err: any, caught) => {
      this.eventService.showLoader(false);
        return throwError(err);
    }));
	}

	 setLoader(req) {
    if (!!req){
      let value = req.url.split('?')[0]?.split('/');
      let isGetRequest = (req.method == 'POST');
      let shouldShowLoader = !(['checkEmail'].includes(value[value.length - 1]));
      let Condition = (shouldShowLoader || (!shouldShowLoader && !isGetRequest));
      this.eventService.showLoader(Condition);
    }

  }
}