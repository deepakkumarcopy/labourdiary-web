import { Component, OnInit, AfterContentInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ApiService } from '../../../services/api.service';
declare let google: any;

@Component({
	selector: 'app-category',
	templateUrl: './category.component.html',
	styleUrls: ['./category.component.scss']
})

export class CategoryComponent implements OnInit, AfterContentInit {
	
	@ViewChild('mapElement', {static: true}) mapElement;
	map;
	locations: any = [];
	markers = [];
	services: any = [];
	noServices: boolean = false;
	savedServiceList: any = [];
	user: any = JSON.parse(localStorage.getItem('user'));

	constructor(
		private api: ApiService,
		private route: ActivatedRoute,

	) { }

	ngOnInit(): void {
		this.route.params.subscribe((params) => {
			console.log(params)
			let data = {
				catId: params.id,
				cityName: 'kanpur'
			}
			this.api.getAllServiceByCategory(data).subscribe((res) => {
				console.log(res)
				if (res.success) {
					this.services = res.services;
					res.services.forEach(element => {
						this.services.push(element)
					});
					res.services.forEach(element => {
						this.services.push(element)
					});
					this.getValueInMap(res.services);
				}
				this.services.length ? this.noServices = false : this.noServices = true;
			},(e) => {
				this.noServices = true;
			});
		});

		this.api.getListOfSavedServicesByUserId(this.user.id).subscribe((res) => {
			if (res.success) {
				this.savedServiceList = res.savedServiceList;
			}
		});
	}

	checkSavedService(id: string) {
		return this.savedServiceList.find((item: any) => item == id);
	}

	saveServiceProvider(service) {
		let data = {
			serviceId: service.id,
			createdByUserId: this.user.id,
			user: service.user.id
		}
		this.savedServiceList.push(service.id)
		this.api.saveService(data).subscribe((res) => {
			if (!res.success) {
				this.removeFromSaved(service.id);
			}
		}, (e) => {
			this.removeFromSaved(service.id);
		})
	}

	removeFromSaved(serviceId: string) {
		let index = this.savedServiceList.indexOf(serviceId);
		this.savedServiceList.splice(index, 1);
	}

	removeSavedServiceProvider(service: any) {
		this.removeFromSaved(service.id);
		this.api.getSavedServicesByService(service.id).subscribe((res) => {
			if (res.success) {
				this.api.deleteSaveServices(res.savedservices[0].id).subscribe((res) => {
					if (!res.success) {
						this.savedServiceList.push(service.id);
					}
				}, (e) => {
					this.savedServiceList.push(service.id);
				});
			} else {
				this.savedServiceList.push(service.id)
			}
		}, (e) => {
			this.savedServiceList.push(service.id)
		});
	}

	ngAfterContentInit(): void {
		console.log('map')
		// this.geolocation.getCurrentPosition().then((resp) => {
	  		this.loadMap();
		// }).catch((error) => {
		// 	console.log('Error getting location', error);
		// });
	}

	getValueInMap(service) {
		service.forEach(element => {
			this.locations.push({ name: element.name, about: element.about, imageUrl: element.user.imageUrl != 'null' ? element.user.imageUrl : 'assets/img/personImg.jpg', lat: parseFloat(element.lat), lng: parseFloat(element.lng) })
		});
		this.showMarkPointer();
	}//Show service provider location
	showMarkPointer() {
		for (var i = 0; i < this.locations.length; i++) {
			this.markers[i] = new google.maps.Marker({
				position: { lat: this.locations[i].lat, lng: this.locations[i].lng },
				map: this.map,
				icon: {
					url: this.locations[i].imageUrl,
					scaledSize: new google.maps.Size(33, 28),
					origin: new google.maps.Point(0, 0),
					// The anchor for this image is the base of the flagpole at (0, 32).
					anchor: new google.maps.Point(17, -1)
				},
				html:
					`	
						<div id="content" style="position: relative;">
							<div class="card" style="width:300px">
						    <img class="card-img-top" src='${this.locations[i].imageUrl}' alt="Card image" style="width:100%; height:225px">
						    <div class="card-body">
						      <h4 class="card-title">${this.locations[i].name}</h4>
						      <p> ${this.locations[i].about} </p>
						      <p class="card-text">Some example text some example text. John Doe is an architect and engineer</p>
						      <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">
									 'https://en.wikipedia.org/w/index.php?title=Uluru</a>
						    </div>
					  	</div>
				  	</div>`,
				id: i,
			});

			//click on service provide icon
			google.maps.event.addListener(this.markers[i], 'click', function (event) {
				var infowindow = new google.maps.InfoWindow({
					id: this.id,
					content: this.html,
					position: this.getPosition()
				});
				// google.maps.event.addListenerOnce(infowindow, 'closeclick', function () {
				// 	// this.markers[this.id].setVisible(true);
				// });
				// this.setVisible(false);
				infowindow.open(this.map);
				console.log('click on service event', event.latLng.lat(), event.latLng.lng())
			});
		}
	}

	loadMap() {
		let self = this;
		var pos = {
			lat: 27.683528,
			lng: 73.767484
		};
		this.map = new google.maps.Map(this.mapElement.nativeElement, {
			zoom: 6,
			center: pos,
			fullscreenControl: false,
			streetViewControl: false,
			mapTypeControl: false,
			zoomControl: false,
		});

		var geocoder = new google.maps.Geocoder;
		let infoWindow = new google.maps.InfoWindow;

		infoWindow.setPosition(pos);
		// infoWindow.open(this.map);
		this.map.setCenter(pos);

		let marker = new google.maps.Marker({
			position: pos,
			map: this.map,
			draggable: true
		});

		//click on current user marker
		google.maps.event.addListener(marker, 'click', function (event) {
			console.log('click on marker event', event.latLng.lat(), event.latLng.lng());
			var latlng = { lat: parseFloat(event.latLng.lat()), lng: parseFloat(event.latLng.lng()) };

			self.showCurrentUserLocation(latlng, geocoder, infoWindow, self.map);
		});

		//click on all map
		google.maps.event.addListener(this.map, 'click', function (event) {
			console.log('click on map event', event.latLng.lat(), event.latLng.lng());
			var latlng = { lat: parseFloat(event.latLng.lat()), lng: parseFloat(event.latLng.lng()) };

			self.showCurrentUserLocation(latlng, geocoder, infoWindow, self.map);
		});

		//show current user location using dragend
		marker.addListener('dragend', function (event) {
			console.log('dragend on map event', event.latLng.lat(), event.latLng.lng())
			var latlng = { lat: parseFloat(event.latLng.lat()), lng: parseFloat(event.latLng.lng()) };

			self.showCurrentUserLocation(latlng, geocoder, infoWindow, self.map);
		})
	}

	//show current user address details
	showCurrentUserLocation(latlng, geocoder, infoWindow, map) {
		geocoder.geocode({ 'location': latlng }, function (results, status) {
			if (status === 'OK') {
				if (results[0]) {
					map.setZoom(15);
					infoWindow.setPosition(latlng);
					infoWindow.open(map);
					infoWindow.setContent(results[0].formatted_address);
					map.setCenter(latlng);
				} else {
					console.log('No results found');
				}
			} else {
				console.log('Geocoder failed due to: ' + status);
			}
		});
	}

}
