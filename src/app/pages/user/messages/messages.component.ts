import { Component, OnInit, AfterContentInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
	selector: 'app-messages',
	templateUrl: './messages.component.html',
	styleUrls: ['./messages.component.scss']
})

export class MessagesComponent implements OnInit {

	messages: any = [];

	constructor(private api: ApiService,
		private route: ActivatedRoute) { }

	ngOnInit(): void {

		this.getMessage()
		this.messages = [
			{texts: '1234', sender: true},
			{texts: '1234', sender: true},
			{texts: '1234', sender: false},
			{texts: '1234', sender: true},
		]
	}

	getMessage() {
		console.log('messageeeeeeeee')
		let data = {
			id: 12,
			page_num: 20,
			skips: 1 * 20
		}
		this.api.getMessage(data).subscribe((res) => {
			console.log(res, 'responseee')
			if(res.success){
				console.log(res, 'responseeeeeeeee')
			}
		})
	}
}
