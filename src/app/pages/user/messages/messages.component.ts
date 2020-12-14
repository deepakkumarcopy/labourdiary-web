import { Component, OnInit, AfterContentInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../../services/notification.service';
import { DatePipe } from '@angular/common';
declare var $:any;
@Component({
	selector: 'app-messages',
	templateUrl: './messages.component.html',
	styleUrls: ['./messages.component.scss']
})

export class MessagesComponent implements OnInit {
	@ViewChild('scrollBottom') private scrollBottom: ElementRef;
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
	isUserOrProvider:any;
	userChat: any = JSON.parse(localStorage.getItem('user-chat'));
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
		});
	}
	
	ngOnInit(): void {
		this.isUserOrProvider = this.router.url.split('/')[1]
		this.route.params.subscribe((params) => {
			if (!!params && params.id) {
				this.createChannel(params.id)
			}
		})
		// this.getMessage()
		this.getRecentUsers()
		this.scrollToBottom();
		

	}
	ngAfterViewInit() {
		setTimeout(()=>{
			if(!!this.userChat) {
				let id = 'user_'+this.userChat.id 
				$('#'+id).click()
			}  else {
				// console.log($('.chat-window')[0], 'user chatttttttttttttttttttttt')
				$('.chat-window')[0].click()
			}

		},2000)
	}
	scrollToBottom(): void {
		setTimeout(() => {
			try {
            this.scrollBottom.nativeElement.scrollTop = this.scrollBottom.nativeElement.scrollHeight;
			} catch (err) { }
		}, 2000)
    }
	createChannel(serviceId) {
		let data = {
			sender: this.user.id,
			receiver: serviceId,
			userChatId: this.user.id,
			providerChatId: serviceId
		}
		this.api.createChannel(data).subscribe((res) => {
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
		let data = {
			id: channelId,
			page_num: 10,
			skips: this.page_size * this.page_num,
		}
		console.log(this.page_size, this.page_num, 'page numberrr')
		this.api.getMessage(data).subscribe((res) => {
			if (res.success) {
				this.isLoading = false;
				this.userMessage = this.userMessage.concat(res.messages);
				this.page_size++;
			} else {
				this.userMessage = []
				this.isLoading = false
				this.page_size = 0;
			}
		})
	}

	getRecentUsers() {
		console.log('getRecentUsers')
		let data 
		if (this.isUserOrProvider == 'message') {
			data = {
				userId: this.user.id,
				userChatId: this.user.id,
				page_num: 10,
				skips: 0
			}
		} else {
			data = {
				userId: this.user.id,
				providerChatId: this.user.id,
				page_num: 10,
				skips: 0
			}
		}
		this.api.getRecentUsers(data).subscribe((res) => {
			console.log(res, 'responsee og getRecentUsers')
			if (res.success) {
				this.message = res.users;
				console.log(this.message, 'get recent usersssssssssssssssss')

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
		this.scrollToBottom()
		let data: any = {
			sender: this.user.id,
			receiver: this.reciverUser.id,
			texts: this.newMsg,
			channelId: this.reciverUser.channelId,
			senderType: "User"
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
		this.page_size = 0
		this.scrollToBottom(); 
		this.reciverUser = user;
		console.log(this.reciverUser, 'userrr')
		this.message.forEach((msg)=>{
			msg.selected = (msg.id == user.id ? true : false);
			if(msg.id == user.id){
				msg.count = 0
			}
		});
		const selectedUser = this.message.find((msg)=>msg.selected == true)
		this.markAsRead(selectedUser)
		localStorage.setItem('user-chat', JSON.stringify(selectedUser));
		this.getMessage(user.channelId);

	}
	getMessagesDate(user: any) {
		if (!user.lastMessage.length)
			return '---'

		let value = user.lastMessage[0].createdAt;
		var _value = Number(value);

		var dif = Math.floor(((Date.now() - _value) / 1000) / 86400);

		if (dif < 30) {
			return this.convertToNiceDate(value);
		} else {
			var datePipe = new DatePipe("en-US");
			value = datePipe.transform(value, 'MMM-dd-yyyy');
			return value;
		}
	}
	convertToNiceDate(time: string) {
		var date = new Date(time),
			diff = (((new Date()).getTime() - date.getTime()) / 1000),
			daydiff = Math.floor(diff / 86400);

		if (isNaN(daydiff) || daydiff < 0 || daydiff >= 31)
			return '';

		return daydiff == 0 && (
			diff < 60 && "Just now" ||
			diff < 120 && "1 minute ago" ||
			diff < 3600 && Math.floor(diff / 60) + " minutes ago" ||
			diff < 7200 && "1 hour ago" ||
			diff < 86400 && Math.floor(diff / 3600) + " hours ago") ||
			daydiff == 1 && "Yesterday" ||
			daydiff < 7 && daydiff + " days ago" ||
			daydiff < 31 && Math.ceil(daydiff / 7) + " week(s) ago";
	}

	markAsRead(user) {
		let data = {
			channelId: user.channelId,
			senderId: user.receiverId,
			deliveryStatus: 'Read'
		}
		this.api.markAsRead(data).subscribe((res) => { })
	}

	delete(userChat: any, i: number) {
		this.message.splice(i, 1);
		this.api.deleteChannel(userChat.channelId).subscribe((res: any) => {
			if (res.success) {
				let msg = this.message[this.message.length -1]
				let id = 'user_'+ msg.id 
				$('#'+id).click();
				// this.message.length ? this.noServices = false : this.noServices = true;
			} else {
				this.message.splice(i, 0, userChat);
				// this.message.length ? this.noServices = false : this.noServices = true;
			}
		}, (error) => {
			this.message.splice(i, 0, userChat);
		})
	}

}
