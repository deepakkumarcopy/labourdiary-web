import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  user: any = JSON.parse(localStorage.getItem('user'));
  stats: any = [];
  isLoading: boolean = true;
  month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  currDate: any;
  constructor(
    private route: Router,
    private api: ApiService,
  ) { }

  ngOnInit(): void {

    this.getUserStats();
  }
  getUserStats() {
    this.api.progressStats(this.user.id).subscribe((res) => {
      console.log(res, 'responseeee')
      if (res.success) {
        this.isLoading = false;
        this.stats = res;
        this.currDate = this.month[new Date().getMonth()];
      }
    });
  }
}
