import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {
  isLoading: boolean = true;
  reviews: any = [];
  constructor(private api: ApiService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
     this.getUserReviews();
  }
  getUserReviews() {
    const id = "5f929fafcf215b0ea4ada225";
    this.api.getUserComments(id).subscribe((res) => {
      console.log(res, 'responseeeeeeeeeeeee');
      if (res.success) {
        this.isLoading = false;
        this.reviews = res.reviews;
      } else {
        this.isLoading = false;
        // this.orders = [];
      }
    }, err => {
        this.isLoading = false;
        console.log('something went wrong');
    });
  }
}
