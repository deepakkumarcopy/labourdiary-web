import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-views-and-bookings',
  templateUrl: './views-and-bookings.component.html',
  styleUrls: ['./views-and-bookings.component.scss']
})
export class ViewsAndBookingsComponent implements OnInit {
  user: any = JSON.parse(localStorage.getItem('user'));
  isLoading: boolean = true;
  viewsAndBookings:any = [];
  views:any=[];
  bookings:any =[];
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartData: ChartDataSets[];
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  constructor(private api: ApiService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.getServiceEarning();
  }
  getServiceEarning() {
    this.api.serviceViewsAndBookings(this.user.id).subscribe((res) => {
      if (res.success) {
        this.isLoading = false;
        this.viewsAndBookings = res.viewsBookingsEarning;
        this.viewsAndBookings.forEach((data) => {
          this.barChartLabels.push(data.date);
          this.views.push(data.viewsCount);
          this.bookings.push(data.bookingsCount);
          this.barChartData = [{data: this.views, barThickness: 100, label: 'Views'}, {data: this.bookings, barThickness: 100, label: 'Bookings'}]
        });
      } else {
        this.isLoading = false;
      }
    }, err => {
        this.isLoading = false;
        console.log('something went wrong');
    });
  }

}
