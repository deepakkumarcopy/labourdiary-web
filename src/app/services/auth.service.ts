import { Injectable, Inject } from '@angular/core';
import { map, catchError } from 'rxjs/operators';

import { throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { resolve } from 'dns';
import { rejects } from 'assert';
import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from 'firebase/app';
declare var FB: any;
import { switchMap } from "rxjs/operators";

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	baseUrl = environment.baseUrl;
	
	constructor(
		private http: HttpClient,
		private angularFire: AngularFireAuth,
        // @Inject("window") private _window: any,

		) {
			(window as any).fbAsyncInit = function () {
			FB.init({
				appId: '3161590723853934',
				cookie: true,
				xfbml: true,
				version: 'v3.1'
			});
			FB.AppEvents.logPageView();
		};

		(function (d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) { return; }
			js = d.createElement(s); js.id = id;
			js.src = "https://connect.facebook.net/en_US/sdk.js";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
	}

	googleLogin() {
		return new Promise((resolve, rejects) => {
			this.angularFire.signInWithPopup(new auth.GoogleAuthProvider()).then((result) => {
				let user: any = result.additionalUserInfo.profile;
				this.socialLoginProcess(user.givenName, user.familyName, user.picture, user.email, user.email.substring(0, user.email.indexOf("@")), 0, user.userId, 0).then(res => {
					resolve(res)
				}).catch((error) => {
					rejects(error)
				});
			}).catch((error) => {
				rejects(error)
			})
		})
	}

	facebookLogin() {
		return new Promise((resolve, rejects) => {
			FB.login(function (response) {
				console.log(response)
				if (response.authResponse) {
					resolve(response)
					console.log('Welcome!  Fetching your information.... ');
					FB.api('/me', function (response) {
						console.log('Good to see you, ' + response.name + '.');
					});
				} else {
					console.log('User cancelled login or did not fully authorize.');
				}
			});
		});
	}

	async linkedInLogin() {

		(window as any).popup = window.open(`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=78b32kqcfmc0wv&redirect_uri=http://54.174.40.59/callback&scope=r_liteprofile%20r_emailaddress`, '_blank', 'location=yes');
		(window as any).popup.onload = function(event) {
			console.log(event)
		}
		// console.log(linkedIn)
		// window.onload = (event)=> {
		// 	console.log(event)
		// }
		// var initialiseTable = function () {
		// 	console.log("hello world!!");
		// };
		// window.addEventListener('load', initialiseTable, false)
	}


	socialLoginProcess(firstName, lastName, image, email, password, fbId, googleId, linkedInId) {
		return new Promise((resolve, rejects) => {
			this.socialLogin(firstName, lastName, null, image, email, password, fbId, googleId, linkedInId).subscribe((res) => {
				resolve(res);
			}, (e => {
				rejects(e)
			}));
		})
	}

	socialLogin(firstName, lastName, imageData, imageSocialUrl, email, password, fbId, googleId, linkedinId) {

		let form = new FormData();

		form.append('firstName', firstName);
		form.append('lastName', lastName);
		form.append('email', email);
		form.append('password', password);
		if (!!fbId) form.append('fbId', fbId);
		if (!!googleId) form.append('googleId', googleId);
		if (!!linkedinId) form.append('linkedinId', linkedinId);
		form.append('imageFile', imageData)
		form.append('imageUrl', imageSocialUrl);

		return this.http.post(`${this.baseUrl}/api/social_login`, form).pipe(
			map((res: any) => res),
			catchError(error => throwError(error.error || 'Server Error')));
	}

	login(data: any) {
		return this.http.post(`${this.baseUrl}/api/sign_in`, data).pipe(
			map((res: any) => res),
			catchError(error => throwError(error.error || 'Server Error')));
	}

	signUp(data: any) {

		let form = new FormData();

		form.append('firstName', data.firstName);
		form.append('lastName', data.lastName);
		form.append('email', data.email);
		form.append('password', data.password);
		form.append('profile', data.imageData)

		return this.http.post(`${this.baseUrl}/api/sign_up`, form).pipe(
			map((res: any) => res),
			catchError(error => throwError(error.error || 'Server Error')));
	}

	imageUpload(data) {
		let form = new FormData();

		form.append('userId', data.id);
		form.append('profile', data.files)

		return this.http.post(`${this.baseUrl}/api/updateUserImage`, form).pipe(
			map((res: any) => res),
			catchError(error => throwError(error.error || 'Server Error')));
	}
}
