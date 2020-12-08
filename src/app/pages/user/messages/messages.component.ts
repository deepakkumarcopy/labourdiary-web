import { Component, OnInit, AfterContentInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-messages',
	templateUrl: './messages.component.html',
	styleUrls: ['./messages.component.scss']
})

export class MessagesComponent implements OnInit {
	user: any = JSON.parse(localStorage.getItem('user'));
	messages: any = [];
	message:any;
	lastMessage:any;
	newMsg:any;
	selectedUser:any;
	userMessage:any=[];
	constructor(private api: ApiService,
		private route: ActivatedRoute,
		private router: Router,
		private tostr: ToastrService) { }

	ngOnInit(): void {
		this.route.params.subscribe((params) => {
			if(!!params && params.id) {
				this.createChannel(params.id)
			}
		})
		// this.getMessage()
		this.messages = [
			{texts: '1234', sender: true},
			{texts: '1234', sender: true},
			{texts: '1234', sender: false},
			{texts: '1234', sender: true},
		]
	}
	createChannel(serviceId) {
	    let data = {
	      sender: this.user.id,
	      receiver: serviceId,
	      userChatId: this.user.id,
	      providerChatId: serviceId
	    }
	    this.api.createChannel(data).subscribe((res)=>{
	      console.log(res)
	      if(res.success) {
	      	this.getRecentUsers();
	      } else {
	      	this.router.navigate(['order']);
	      	this.tostr.warning(res.message)

	      }
	    }, error =>{
	    	this.tostr.error('Something went wrong')
	    })
  	}
	getMessage(channelId) {
		console.log('messageeeeeeeee')
		let data = {
			id: channelId,
			page_num: 20,
			skips: 0 * 20
		}
		this.api.getMessage(data).subscribe((res) => {
			console.log(res, 'messageeeeeeeee rrrrrrrrrrr')
			if(res.success){
				console.log(res, 'responseeeeeeeee')
			}
		})
	}

	getRecentUsers() {
		let data = {
			userId: this.user.id,
			userChatId: this.user.id,
			page_num: 10,
			skips: 0
		}
		this.api.getRecentUsers(data).subscribe((res) => {
			if (res.success) {
				this.message = res.users;
				console.log(this.message, 'responseee')
				
				if(this.message){
					this.message.forEach((msg)=>{
						if(msg && msg.lastMessage){

							this.lastMessage = msg.lastMessage[msg.lastMessage.length-1]
							this.selectedUser = msg.lastMessage.find((msg)=>msg.sender == this.user.id)
						}
					})
					console.log(this.selectedUser, 'msggg')
				}
				this.getMessage(res.users.channelId)
			} else {

			}
		}, (e) => {
			
		});
	}

	sendMessage() {
		console.log('send messageee')
		if (!this.newMsg) {
			return;
		}

		let data: any = {
			sender: this.user.id,
			receiver: this.selectedUser.receiver,
			texts: this.newMsg,
			channelId: this.selectedUser.channelId,
			senderType: this.selectedUser.senderType
		}
		console.log(data, 'data', this.selectedUser)
		this.api.createMessage(data).subscribe((res)=>{
			console.log(res, 'responseee of message')
			this.userMessage.push(res.message)
		})
	}
}
