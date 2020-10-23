import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ApiService } from '../../../services/api.service';
@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit {

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
