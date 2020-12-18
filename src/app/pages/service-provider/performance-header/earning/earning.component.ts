import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
// import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
// import { Label } from 'ng2-charts';
@Component({
  selector: 'app-earning',
  templateUrl: './earning.component.html',
  styleUrls: ['./earning.component.scss']
})
export class EarningComponent implements OnInit {
  user: any = JSON.parse(localStorage.getItem('user'));
  isLoading: boolean = true;
  viewsAndBookings:any = [];
  earnings:any =[];
  // public barChartOptions: ChartOptions = {
  //   responsive: true,
  // };
  // public barChartData: ChartDataSets[];
  // public barChartLabels: Label[] = [];
  // public barChartType: ChartType = 'bar';
  // public barChartLegend = true;
  // public barChartPlugins = [];
  constructor(private api: ApiService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.getEarnings();
  }
  getEarnings() {
    this.api.serviceViewsAndBookings(this.user.id).subscribe((res) => {
      console.log(res, 'service responseeee');
      if (res.success) {
        this.isLoading = false;
        this.viewsAndBookings = res.viewsBookingsEarning;
        this.viewsAndBookings.forEach((data) => {
          // this.barChartLabels.push(data.date);
          this.earnings.push(data.earning);
          // this.barChartData = [{data: this.earnings, barThickness: 100, label: 'Earnings'}];
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
