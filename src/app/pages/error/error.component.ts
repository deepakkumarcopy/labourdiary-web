import { Component, OnInit } from '@angular/core';
declare var anime: any;  

@Component({
	selector: 'app-error',
	templateUrl: './error.component.html',
	styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

	constructor() { }

	ngOnInit(): void {
		anime({
			targets: '.row svg',
			translateY: 10,
			autoplay: true,
			loop: true,
			easing: 'easeInOutSine',
			direction: 'alternate'
		});

		anime({
			targets: '#zero',
			translateX: 10,
			autoplay: true,
			loop: true,
			easing: 'easeInOutSine',
			direction: 'alternate',
			scale: [{ value: 1 }, { value: 1.4 }, { value: 1, delay: 250 }],
			rotateY: { value: '+=180', delay: 200 },
		});
	}
}