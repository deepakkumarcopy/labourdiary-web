import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';

declare var require: any;
const config = require('../../assets/js/w3socket.config.json');
declare var W3sockets: any;

@Injectable({
	providedIn: 'root'
})

export class NotificationService {

	private hostUrl = "https://www.w3sockets.com";

	grantType = "client_credentials";
	w3socket: any;
	publicKey = "";
	secretKey = "";
	user = JSON.parse(localStorage.getItem('user'));

	constructor(
		private route: Router,
		private http: HttpClient,
	) {
		this.publicKey = config.public_key;
		this.secretKey = config.secret_key;
		this.w3socket = new W3sockets(this.publicKey);
	}

	subscribeEvent(event) {
		return this.w3socket.subscribe(event);
	}

	unsubscribeEvent(event) {
		return this.w3socket.unsubscribe(event);
	}

	subscribeSuspend() {
		let w3channel = this.subscribeEvent('labour-dairy');
		w3channel.bindEvent(`active-inactive-${this.user.id}`, async (msg: any) => {
			if (window.confirm(msg.message)) {
				this.goToLogin();
			} else {
				this.goToLogin();
			}
		})
	}

	goToLogin() {
		localStorage.clear();
		this.route.navigate(['/']);
		this.unsubscribeEvent('labour-dairy');
	}

	getAccessToken = async function () {

		let accessTokenFromStorage = localStorage.getItem('w3socket_keys');
		if (!!accessTokenFromStorage) {
			let accessTokens = JSON.parse(accessTokenFromStorage);
			let expireTime = (Date.now() / 1000) + accessTokens.expires_in;
			let currentTime = (Date.now() / 1000)
			console.log(expireTime, currentTime);
			if (expireTime > currentTime) {
				return accessTokens;
			}
		}

		var accessTokenOptions = {
			url: `${this.hostUrl}/oauth/token`,
			form: {
				client_id: this.publicKey,
				client_secret: this.secretKey,
				grant_type: this.grantType
			},
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		};

		let response = await this.http.post(accessTokenOptions.url, accessTokenOptions.form, accessTokenOptions.headers).toPromise();
		localStorage.setItem('w3socket_keys', JSON.stringify(response.json()));

		return response.json();
	};

	pushToServer(channel, event, message, accessToken) {
		let data = {
			channel: `${this.publicKey}-${channel}`,
			event: event,
			message: message
		};

		let pushOptions: any = {
			url: `${this.hostUrl}/api/v1/push/notify`,
			form: {
				access_token: accessToken,
				data: data
			},
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		};

		return this.http.post(pushOptions.url, pushOptions.form, pushOptions.headers).pipe(
			map((res: any) => res),
			catchError(error => throwError(error.error || 'Server Error')));
	}

	pushToFirebase(channel, event, message, accessToken) {

		let device = {
			"access_token": accessToken,
			"data": {
				"message": {
					"body": "sendder_message",
					"name": "Sender_name"
				},
				"channel": `${this.publicKey}-labour-dairy`,
				"receiver_id": "5ed78546620bb0e5521fe5e",
				"data": "this is data"
			}
		}
		return this.http.post(`${this.hostUrl}/api/v1/push/push_notification/`, device).pipe(
			map((res: any) => res),
			catchError(error => throwError(error.error || 'Server Error')));
	}

	async push(channel, event, message) {
		let ref = this;
		return await ref.getAccessToken().then((accessToken) => {
			if (accessToken) {
				ref.pushToServer(channel, event, message, accessToken.access_token).subscribe((res) => {
				});
			} else {
				console.log('Error connecting: ', accessToken);
			}
		}, error => {
			console.log('error', error);
		});
	}
}