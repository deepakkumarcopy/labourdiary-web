import { Component, OnInit,  ViewChild , ChangeDetectorRef, Input, OnChanges} from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { CommonService } from '../../../services/common.service';
declare let google: any;
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
declare var $:any;

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnChanges {

  @ViewChild('mapElement', { static: true }) mapElement;
  @Input() windowEvent;
  user: any = JSON.parse(localStorage.getItem('user'));
  userImage: any = this.user ? this.user.imageUrl : null;
  isDropdown:boolean = false;
  map;
  locationDrop: any;
  lagLatDrpoed: any;
  categories:any;
  lacations:any = ['Kanpur','delhi','mumbai']
  showDatalist:boolean = false;
  selectedDate:any;
  selectedCategory:any;
  location:any;
  isScroll:boolean = false;
  isSearch:boolean=false;
  constructor(
    private common: CommonService,
    private modalService: ModalService,
    private changeDetectorRef: ChangeDetectorRef,
    private api: ApiService,
    private router: Router,
  ) {
    this.common.subscribeData().subscribe(res => {
      if (!!res.login) {
          this.user = res.login;
          this.userImage = res.login.imageUrl;
      }
    });
  }

  ngOnInit(): void {
    this.getCategory();

  }
  ngAfterViewInit() {
    this.initMap()

  }
  ngOnChanges() {
    if(this.windowEvent == 'top') {
      this.isScroll = true;
      setTimeout(()=>{

        this.initMap();
      },100)
    } else {
      this.isScroll = false
      this.isSearch = false
    }

  }
  showSearch() {
    setTimeout(()=>{

      this.initMap();
    },100)
    this.isSearch = true;
  }
  
  openModal(id) {
    this.modalService.open(id)
  }

  closeModal(id) {
    this.modalService.close(id);
  }
  
  getCategory() {
    this.api.getCategory().subscribe((res) => {
      if (!!res.success) {
          this.categories = res.category;
      }
    });
  }

  datepicker(){
    $('#date-picker-example').datepicker({
      format: 'mm/dd',
      autoclose: true
    });
  }
  
  searchedCategory() {
    this.router.navigate(['user/search',this.location,this.selectedCategory]);
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

  getUserSavedService() {
    this.router.navigate(['user/saved/service', this.user.id]);
  }

  navigateToOrders() {
    this.router.navigate(['user/orders']);

  }
  navigateToStats() {
    this.router.navigate(['service-provider/stats']);

  }
  switchToHost() {
    this.router.navigate(['service-provider/stats']);
    
  }
  initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: -33.8688, lng: 151.2195 },
      zoom: 13,
    });
    const card = document.getElementById("location-card");
    const input = document.getElementById("location-input");
    if(!!card && !!input) {
      map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);
      const autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.bindTo("bounds", map);
      // Set the data fields to return when the user selects a place.
      autocomplete.setFields(["address_components", "geometry", "icon", "name"]);
      const infowindow = new google.maps.InfoWindow();
      const infowindowContent = document.getElementById("infowindow-content");
      infowindow.setContent(infowindowContent);
      const marker = new google.maps.Marker({
        map,
        anchorPoint: new google.maps.Point(0, -29),
      });
      autocomplete.addListener("place_changed", () => {
        infowindow.close();
        marker.setVisible(false);
        const place = autocomplete.getPlace();

        if (!place.geometry) {
          // User entered the name of a Place that was not suggested and
          // pressed the Enter key, or the Place Details request failed.
          window.alert("No details available for input: '" + place.name + "'");
          return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17); // Why 17? Because it looks good.
        }
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);
        let address = "";

        if (place.address_components) {
          address = [
            (place.address_components[0] &&
              place.address_components[0].short_name) ||
              "",
            (place.address_components[1] &&
              place.address_components[1].short_name) ||
              "",
            (place.address_components[2] &&
              place.address_components[2].short_name) ||
              "",
          ].join(" ");
        }
      });
    }
  }

}
