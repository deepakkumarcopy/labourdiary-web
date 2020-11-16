import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ModalService } from '../../services/modal.service';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { ImageCroppedEvent } from 'ngx-image-cropper';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
 	user: any = JSON.parse(localStorage.getItem('user'));
  imageChangedEvent: any = '';
  croppedImage: any = '';
  isReadyToCrop:boolean =false;
  cropped:boolean=false;
  constructor(private modalService: ModalService,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
  }
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.cropped = false;
    this.openModal('update-photo')
    this.isReadyToCrop = true;
    console.log('fbhjbfhjervjh')
  }
  imageCropped(event: ImageCroppedEvent) {

      this.croppedImage = event.base64;
      console.log('imageee', event)
  }
  imageLoaded() {
    console.log('imageLoaded')
      // show cropper
  }
  closeModal(id: string) {
    this.modalService.close(id);
  }

  openModal(id: string) {
    this.modalService.open(id);
  } 
  cropperReady() {
    console.log('cropperReady')
      // cropper ready
  }
  loadImageFailed() {
      // show message
  }
  cropImage() {
    const imageName = 'name.png';
    const imageBlob = this.dataURItoBlob(this.croppedImage);
		const imageFile = new File([imageBlob], imageName, { type: 'image/jpeg' });
    console.log(imageFile, 'image filee')
    console.log(this.croppedImage)
    let data = {
      id: this.user.id,
      files: imageFile,
    }
    this.api.imageUpload(data).subscribe((res) => {
      console.log(res, 'image uploadddddddddddd')
      if (res.success) {
        this.toastr.success('Successfully Updated');
        localStorage.setItem('user', JSON.stringify(res.user));
        this.closeModal('update-photo');
      } else {
        this.toastr.info(res.message);
      }
      }, (e) => {
        this.toastr.error('Something went wrong');
        console.log('error')
    });
  }
  dataURItoBlob(dataURI) {
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
	}
}

