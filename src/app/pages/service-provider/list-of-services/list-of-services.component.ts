import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ApiService } from '../../../services/api.service';
@Component({
  selector: 'app-list-of-services',
  templateUrl: './list-of-services.component.html',
  styleUrls: ['./list-of-services.component.scss']
})
export class ListOfServicesComponent implements OnInit {
	user: any = JSON.parse(localStorage.getItem('user'));
  services:any = []
  isLoading:boolean = true;
  constructor(private api: ApiService,
    private router: Router,) { }

  ngOnInit(): void {
  	this.getUserService();
  }
  getUserService() {
    this.api.getUsersService(this.user.id).subscribe((res) => {
    	console.log(res, 'response of user service');
      if (res.success) {
        this.isLoading = false;
        this.services = res.services;

      } else {
        this.isLoading = false;
      }
    }, (e) => {
        this.isLoading = false;
        console.log(e);
    })
  }
}
