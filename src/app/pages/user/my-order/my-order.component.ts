import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ApiService } from '../../../services/api.service';
@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.scss']
})
export class MyOrderComponent implements OnInit {
  user: any = JSON.parse(localStorage.getItem('user'));
  page_num: any = 10;
  page_size: any = 0;
  orders: any = [];
  isLoading:boolean = true;
  constructor(private api: ApiService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.getUserOrders();
  }

  getUserOrders() {
    let data = {
      "id": this.user.id,
      "page_num" :10,
      "skips": this.page_size * this.page_num,
    }
    this.api.getAllOrder(data).subscribe((res) => {
      if (res.success) {
        this.isLoading = false;
        this.orders = this.orders.concat(res.order);
        this.page_size++;
      } else {
        this.page_size = 0;
        this.isLoading = false;
        // this.orders = [];
      }
    },err=>{
        this.isLoading = false;
        console.log('something went wrong')
    });
  }
}
