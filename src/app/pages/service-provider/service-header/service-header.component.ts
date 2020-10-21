import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-service-header',
  templateUrl: './service-header.component.html',
  styleUrls: ['./service-header.component.scss']
})
export class ServiceHeaderComponent implements OnInit {

  constructor(private router: Router,) { }

  ngOnInit(): void {
  }

}
