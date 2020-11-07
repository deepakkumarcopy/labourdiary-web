import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-servicer-provider-bread-crumb',
  templateUrl: './servicer-provider-bread-crumb.component.html',
  styleUrls: ['./servicer-provider-bread-crumb.component.scss']
})
export class ServicerProviderBreadCrumbComponent implements OnInit {
  @Input() stage: any;
  isEmergency:boolean=false;
  isBusiness:boolean=false;
  isWorkInfo:boolean=false
  constructor() { }

  ngOnInit(): void {
    if(this.stage == 'emergency-contact'){
      this.isEmergency = true;
    } else if (this.stage == 'business-information') {
      this.isBusiness = true;
      this.isEmergency = true;
      this.isWorkInfo = true;
    } else if (this.stage == 'work-information') {
      this.isEmergency = true;
      this.isWorkInfo = true;
    }
  }

}
