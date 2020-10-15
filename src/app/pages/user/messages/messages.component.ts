import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-messages',
	templateUrl: './messages.component.html',
	styleUrls: ['./messages.component.scss']
})

export class MessagesComponent implements OnInit {

	messages: any = [];

	constructor() { }

	ngOnInit(): void {
		this.messages = [
			{texts: '1234', sender: true},
			{texts: '1234', sender: true},
			{texts: '1234', sender: false},
			{texts: '1234', sender: true},
		]
	}

}
