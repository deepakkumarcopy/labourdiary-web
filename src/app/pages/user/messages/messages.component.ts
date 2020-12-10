import { Component, OnInit, AfterContentInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../../services/notification.service';
@Component({
	selector: 'app-messages',
	templateUrl: './messages.component.html',
	styleUrls: ['./messages.component.scss']
})

export class MessagesComponent implements OnInit {
	user: any = JSON.parse(localStorage.getItem('user'));
	messages: any = [];
	message: any;
	lastMessage: any;
	newMsg: any;
	selectedUser: any;
	userMessage: any = [];
	reciverUser: any;
	isLoading: boolean = true;
	page_num: any = 10;
	page_size: any = 0;
	w3channel: any;

	constructor(
		private api: ApiService,
		private route: ActivatedRoute,
		private router: Router,
		private tostr: ToastrService,
		private notificationService: NotificationService
	) {
		this.w3channel = this.notificationService.subscribeEvent('labour-dairy');
		this.w3channel.bindEvent(`message-${this.user.id}`, async (msg) => {
			console.log(msg)
		})
	}

	ngOnInit(): void {
		this.getRecentUsers()
		this.route.params.subscribe((params) => {
			if (!!params && params.id) {
				this.createChannel(params.id)
			}
		})
		// this.getMessage()
		this.messages = [
			{ texts: '1234', sender: true },
			{ texts: '1234', sender: true },
			{ texts: '1234', sender: false },
			{ texts: '1234', sender: true },
		]
	}

	createChannel(serviceId) {
		let data = {
			sender: this.user.id,
			receiver: serviceId,
			userChatId: this.user.id,
			providerChatId: serviceId
		}
		this.api.createChannel(data).subscribe((res) => {
			console.log(res, 'create channelllllllll')
			if (res.success) {
				this.getRecentUsers();
				this.getMessage(res.channel.id)
			} else {
				this.router.navigate(['order']);
				this.tostr.warning(res.message)

			}
		}, error => {
			this.tostr.error('Something went wrong')
		})
	}

	getMessage(channelId) {
		console.log('messageeeeeeeee')
		let data = {
			id: channelId,
			page_num: 10,
			skips: this.page_size * this.page_num,
		}
		this.api.getMessage(data).subscribe((res) => {
			console.log(res, 'messageeeeeeeee rrrrrrrrrrr')
			if (res.success) {
				this.isLoading = false;
				this.userMessage = this.userMessage.concat(res.messages);
				this.page_size++;
				console.log(res, 'responseeeeeeeee')
			} else {
				this.isLoading = false
				this.page_size = 0;
			}
		})
	}

	getRecentUsers() {
		let data = {
			userId: this.user.id,
			providerChatId: this.user.id,
			page_num: 10,
			skips: 0
		}
		this.api.getRecentUsers(data).subscribe((res) => {
			if (res.success) {
				this.message = res.users;
				console.log(this.message, 'responseee')

				if (this.message) {
					this.message.forEach((msg) => {
						if (msg && msg.lastMessage) {

							this.lastMessage = msg.lastMessage[msg.lastMessage.length - 1]
							this.selectedUser = msg.lastMessage.find((msg) => msg.sender == this.user.id)
						}
					})
					console.log(this.selectedUser, 'msggg')
				}
				// this.getMessage(res.users.channelId)
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
		this.api.createMessage(data).subscribe((res) => {
			if (res.success) {
				console.log(res, 'responseee of send message')
				this.userMessage.push(res.message)
				this.getRecentUsers()
				this.newMsg = ''
				// this.getMessage(data.channelId);
			}

		})
	}

	userChatWindow(user) {
		this.reciverUser = user;
		this.getMessage(user.channelId);
	}
}
