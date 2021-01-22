import { Component, OnInit, AfterContentInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ModalService } from '../../../services/modal.service';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Select2OptionData } from 'ng-select2';
import { ToastrService } from 'ngx-toastr';
declare let google: any;
declare var jQuery: any;

@Component({
	selector: 'app-work-information',
	templateUrl: './work-information.component.html',
	styleUrls: ['./work-information.component.scss']
})
export class WorkInformationComponent implements OnInit {
	@ViewChild('mapElement', { static: true }) mapElement;
	map;
	workInformationForm: any;
	categories: Array<Select2OptionData>;
	formattedCategoriesList: Array<Select2OptionData>;
	formattedSubCategoriesList: Array<Select2OptionData> = [];
	subCategories: any = [];
	searchCategory: any = [];
	options: any;
	category: any;
	isWorkImages: boolean = false;
	workImages: any = [];
	workImagesToUpload: any = [];
	selectedCategories: any = []
	user: any = JSON.parse(localStorage.getItem('user'));
	isWorkInfo: any = JSON.parse(localStorage.getItem('work'));
	isWorkPhotos: any = JSON.parse(localStorage.getItem('work-photo'));
	latitude: any;
	longitude: any;
	providerStage: any = 'work-information';
	subCategory:any;
	selectedCategoryOption:any = []
	selectedCategoryId:any ="";
	count:number = 0;
	constructor(private modalService: ModalService,
		private api: ApiService,
		private route: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService,
	) { }

	ngOnInit(): void {
		this.setWorkInformationForm();
		this.api.getCategory().subscribe((res) => {
			this.categories = res.category;
			this.formattedCategoriesList = this.api.formatCategoryList(res.category);
			console.log(this.categories, 'categories')
			this.searchCategory = res.category;
		});
		this.options = {
			width: '420',
			multiple: true,
			templateResult: this.templateResult,
			templateSelection: this.templateSelection
		};

		if (this.isWorkInfo) {
			this.workImages = this.isWorkPhotos
			this.isWorkInfo.category.forEach((id) => {
				this.getSubCategory(id)
			})
		}
		this.loadMap();

	}
	public templateResult = (state: Select2OptionData): any => {

		return jQuery('<span>' + state.text + '</span>');
	}

	// function for selection template
	public templateSelection = (state: Select2OptionData): any => {

		return jQuery('<span>' + state.text + '</span>');
	}

	setWorkInformationForm() {
		this.workInformationForm = new FormGroup({
			location: new FormControl(this.isWorkInfo ? this.isWorkInfo.location : '', [Validators.required]),
			category: new FormControl(this.isWorkInfo ? this.isWorkInfo.category : '', [Validators.required]),
			subCategory: new FormControl(this.isWorkInfo ? this.isWorkInfo.subCategory : '', [Validators.required]),
			fee: new FormControl(this.isWorkInfo ? this.isWorkInfo.fee : '', [Validators.required]),
			englishLevel: new FormControl(this.isWorkInfo ? this.isWorkInfo.englishLevel : '', [Validators.required]),
			employeType: new FormControl(this.isWorkInfo ? this.isWorkInfo.employeType : '', [Validators.required]),
			about: new FormControl(this.isWorkInfo ? this.isWorkInfo.about : '', [Validators.required]),
			photo: new FormControl(''),
		});
	}

	closeModal(id: string) {
		this.modalService.close(id);
	}

	openModal(id: string) {
		this.modalService.open(id);
		this.subCategory = ''

	}
	savedWorkInformation() {
		if (this.workInformationForm.status == 'INVALID') {
			return;
		}
		const categoryName: any = [];
		this.getSelectedCategory();

		const form = new FormData();
		form.append('name', this.selectedCategories);
		form.append('user', this.user.id);
		form.append('price', this.workInformationForm.value.fee);
		form.append('about', this.workInformationForm.value.about);
		form.append('employeeType', this.workInformationForm.value.employeType);
		form.append('englishLevel', this.workInformationForm.value.englishLevel);
		form.append('lat', this.latitude);
		form.append('lng', this.longitude);
		form.append('cityName', 'kanpur');
		form.append('state', 'Uttar Pradesh');
		for (const cat of this.workInformationForm.value.category) {
			form.append('categories[]', cat);
		}
		for (const subCat of this.workInformationForm.value.subCategory) {
			form.append('subcategories[]', subCat);
		}
		for (const img of this.workImagesToUpload) {
			form.append('images', img);
		}
		console.log(this.workInformationForm.value);
		if (!this.isWorkInfo) {
			this.api.registerAsServiceProvider(form).subscribe((res) => {
				if (res.success) {
					this.toastr.success(res.message);
					console.log(res.service)
					localStorage.setItem('work', JSON.stringify(this.workInformationForm.value))
					localStorage.setItem('work-photo', JSON.stringify(res.service.workPhotos))

					this.router.navigate(['/business-information']);
				} else {
					this.toastr.info(res.message);
				}
			}, (e) => {
				this.toastr.error(e.message);
				console.log('error')
			});
		} else {
			localStorage.setItem('work', JSON.stringify(this.workInformationForm.value))
			localStorage.setItem('work-photo', JSON.stringify(this.workImages))
			this.router.navigate(['/business-information']);
			this.toastr.success('Sucessfully Updated');
		}
	}

	getSelectedCategory() {
		if (!!this.workInformationForm.value.category) {
			const category = this.workInformationForm.value.category;
			category.forEach((cat) => {
				let fltcategory = this.formattedCategoriesList.find((data) => data.id == cat);
				if (!!fltcategory) {
					this.selectedCategories.push(fltcategory.text);
				}
			});
		}
	}

	addSubCategory() {
		let data = {
			name:this.subCategory,
			category:this.selectedCategoryId
		}
		this.api.addSubCategory(data).subscribe((res) => {
			if (res.success) {
				this.subCategories.push(res.subCategory)
				this.formattedSubCategoriesList = this.api.formatCategoryList(this.subCategories)
				this.workInformationForm.controls['subCategory'].setValue([res.subCategory.id]);
				this.closeModal('add-sub-category');

			} else {
				this.toastr.info(res.message);
			}
		}, (e) => {
			this.toastr.error(e.message);
		});
	}
	selectedCategory(e) {
		if (!!this.isWorkInfo) {
			this.workInformationForm.controls['subCategory'].setValue('');

		} else {

			this.workInformationForm.value.subCategory = ''
		}

		if (e && e.length <= 3) {
			const categoryId = e[e.length - 1];
			const cat = this.categories.find((category)=>category.id == categoryId);
			if(cat) {
				const isCategory = this.selectedCategoryOption.find((sc)=>sc.id == cat.id)
				if(!isCategory) {
					this.selectedCategoryOption.push(cat)
				}
			}
			this.getSubCategory(categoryId);
		} else {
			e = e.slice(0, -1);
			this.workInformationForm.controls['category'].setValue(e);
		}
	}
	
	getSubCategory(id) {
		let otherData = {category: "other",
						createdAt: 1608227133287,
						id: "other",
						name: "Other"
		}
		this.api.getSubCategory(id).subscribe((res) => {
			this.count++
			if (res.success) {
				res.data.forEach((data) => {
					this.subCategories.push(data);
				});
				// console.log('subCategories',this.subCategories)
				if(this.count == 1) {

					this.subCategories.push(otherData)
				}
				const getOther = this.subCategories.find((cat)=> cat.id == 'other')
				if(!!getOther) {
					const index: number = this.subCategories.indexOf(getOther);
				    if (index !== -1) {
				        this.subCategories.splice(index, 1);
				        this.subCategories.push(otherData)
				    }  
				}
				console.log('sub categoriesssssssssss',this.subCategories)
				this.formattedSubCategoriesList = this.api.formatCategoryList(this.subCategories)
			}
		});
	}

	selectedSubCategory(cat) {
		if (cat){

			console.log(cat, 'selectedCategory')
			let getOther = cat.find((category)=> category == 'other')
			console.log(getOther, 'get otherrr')
			if(getOther) {
				this.workInformationForm.controls['subCategory'].setValue('');
				this.openModal('add-sub-category');
			}
		}
		if (cat && cat.length > 8) {
			cat = cat.slice(0, -1);
			this.workInformationForm.controls['subCategory'].setValue(cat);
		}
	}

	onSelect(files) {
		for (const file of files.target.files) {
			if (this.workImagesToUpload.length < 10) {
				this.workImagesToUpload.push(file);
				const reader = new FileReader();
				reader.onload = (e: any) => {
					this.workImages.push(e.target.result);
				};
				reader.readAsDataURL(file);
			} else {
				this.toastr.info('You can select only 10 photos !');
			}
		}
	}

	removeImage(i: number) {
		this.workImages.splice(i, 1);
		this.workImagesToUpload.splice(i, 1);
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
			console.log('click on marker event', event.latLng.lat(), event.latLng.lng(), event, infoWindow);
			var latlng = { lat: parseFloat(event.latLng.lat()), lng: parseFloat(event.latLng.lng()) };

			self.showCurrentUserLocation(latlng, geocoder, infoWindow, self.map);
		});

		//click on all map
		google.maps.event.addListener(this.map, 'click', function (event) {
			console.log('click on map event', event.latLng.lat(), event.latLng.lng());

			var latlng = { lat: parseFloat(event.latLng.lat()), lng: parseFloat(event.latLng.lng()) };
			self.latitude = latlng.lat;
			self.longitude = latlng.lng;
			self.workInformationForm.controls['location'].setValue(infoWindow.content);
			self.closeModal('google-map');
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
