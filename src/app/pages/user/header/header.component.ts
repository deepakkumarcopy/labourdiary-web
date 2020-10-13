import { Component, OnInit,  ViewChild , ChangeDetectorRef} from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { CommonService } from '../../../services/common.service';
declare let google: any;

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
	@ViewChild('mapElement', { static: true }) mapElement;

	user: any = JSON.parse(localStorage.getItem('user'));
	userImage: any = this.user ? this.user.imageUrl : null;
	isDropdown:boolean = false;
	map;

	locationDrop: any;
	lagLatDrpoed: any;
	constructor(
		private common: CommonService,
		private modalService: ModalService,
		private changeDetectorRef: ChangeDetectorRef,
		) {
		this.common.subscribeData().subscribe(res => {
			if (!!res.login) {
				this.user = res.login;
				this.userImage = res.login.imageUrl;
			}
		});
	}

	ngOnInit(): void {
	}

	openModal(id) {
		this.modalService.open(id)
	}

	closeModal(id) {
		this.modalService.close(id);
	}
	suggestionDropdown() {
		console.log('ddddd')
		this.isDropdown = true;
	}
	loadMap(location) {
		let self = this;
		var pos = {
			lat: location.coords.latitude,
			lng: location.coords.longitude
		};
		this.map = new google.maps.Map(this.mapElement.nativeElement, {
			zoom: 6,
			center: pos,
			fullscreenControl: false,
			streetViewControl: false,
			mapTypeControl: false,
			zoomControl: false,
		});

		// Create the search box and link it to the UI element.
		const input = document.getElementById('pac-input') as HTMLInputElement;
		const searchBox = new google.maps.places.SearchBox(input);
		this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

		// Bias the SearchBox results towards current map's viewport.
		this.map.addListener('bounds_changed', () => {
			searchBox.setBounds(this.map.getBounds());
		});
		let markers = [];
		// Listen for the event fired when the user selects a prediction and retrieve
		// more details for that place.
		searchBox.addListener('places_changed', () => {
			const places = searchBox.getPlaces();

			if (places.length === 0) {
				return;
			}
			// Clear out the old markers.
			markers.forEach((marker) => {
				marker.setMap(null);
			});
			markers = [];
			// For each place, get the icon, name and location.
			const bounds = new google.maps.LatLngBounds();
			places.forEach((place) => {
				if (!place.geometry) {
					console.log('Returned place contains no geometry');
					return;
				}
				const icon = {
					url: place.icon,
					size: new google.maps.Size(71, 71),
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(17, 34),
					scaledSize: new google.maps.Size(25, 25),
				};
				// Create a marker for each place.
				markers.push(
					new google.maps.Marker({
						map: this.map,
						icon,
						title: place.name,
						position: place.geometry.location,
					})
				);
				this.lagLatDrpoed = { lat: parseFloat(place.geometry.location.lat()), lng: parseFloat(place.geometry.location.lng()) };

				this.locationDrop = place.formatted_address;
				if (place.geometry.viewport) {
					// Only geocodes have viewport.
					bounds.union(place.geometry.viewport);
				} else {
					bounds.extend(place.geometry.location);
				}
			});
			this.map.fitBounds(bounds);
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
			let self = this;
			this.lagLatDrpoed = latlng
			geocoder.geocode({ 'location': latlng }, function (results, status) {
				console.log(results)
				self.locationDrop = results[0].formatted_address;
				self.changeDetectorRef.detectChanges();
				if (status === 'OK') {
					if (results[0]) {
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
