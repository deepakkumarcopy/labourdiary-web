import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';

import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})

export class NotificationService {

	grantType = "client_credentials";
	w3socket: any;
	publicKey = "";
	secretKey = "";
	user = JSON.parse(localStorage.getItem('user'));

	constructor(
		private socket: Socket,
		private route: Router,
		private http: HttpClient,
	) {
	}

	goToLogin() {
		localStorage.clear();
		this.route.navigate(['/']);
	}

	public sendMessage(message) {
		this.socket.emit('new-message', message);
	}

	joinRoom(id) {
		this.socket.emit('joinRoom', id);
	}

	public getMessages = (id) => {
		return Observable.create((observer) => {
			this.socket.on('new-message', (message) => {
				observer.next(message);
			});
		});
	}
}