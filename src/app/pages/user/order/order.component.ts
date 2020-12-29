import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ApiService } from '../../../services/api.service';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  user: any = JSON.parse(localStorage.getItem('user'));
  page_num: any = 10;
  page_size: any = 0;
  orders: any = [];
  isLoading:boolean = true;
  constructor(private api: ApiService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
			if (!!params && params.id) {
				this.getOrderDetails(params.id)
			}
		})
  }
  getOrderDetails(id) {
    this.api.getOrder(id).subscribe((res) => {    
      console.log(res, 'responseee');
      // if (res.success) {
      //   this.isLoading = false;
      //   this.orders = this.orders.concat(res.order);
      //   this.page_size++;
      // } else {
      //   this.page_size = 0;
      //   this.isLoading = false;
      //   // this.orders = [];
      // }
    },err=>{
        this.isLoading = false;
        console.log('something went wrong')
    });
  }
}
