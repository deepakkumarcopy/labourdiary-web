import { Component, OnInit,Output,EventEmitter, Input , OnDestroy} from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { ToastrService } from 'ngx-toastr';
declare var jQuery:any;


@Component({
  selector: 'app-country-input',
  templateUrl: './country-input.component.html',
  styleUrls: ['./country-input.component.scss']
})
export class CountryInputComponent implements OnInit , OnDestroy{
  @Output() onCountryChange = new EventEmitter<any>();
  @Input() countryCode: any;
  @Input() readOnly: boolean;
  @Input() width: any;

  countries: any;
  formattedCountryList:Array<Select2OptionData>;
  selectedCountry: any;
  public options: Options;

  constructor(private api: ApiService,
              private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getAllCountry();
    if(this.readOnly) {
      this.countryCode = `+${this.countryCode}`;
    }
    this.options = {
      width:this.width || "100%",
      templateResult: this.templateResult,
      templateSelection: this.templateSelection
    };
  }
  getAllCountry() {
    this.api.getcountrycode().subscribe((response) => {
      if(!!response) {
        this.countries = response.countries;
        this.formattedCountryList = this.api.formatCountryList(response.countries);
      }
    });
  }
  valueChanged(e) {
     const fltCountry = this.countries.find((country) => country.dial_code === e);
     if (!!fltCountry) {
      this.onCountryChange.emit({name:fltCountry.name, countryCode: fltCountry.dial_code});
     }
  }

  // function for result template
  public templateResult = (state: Select2OptionData): any => {
    if (!state.id) {
      return state.text;
    }
    return jQuery('<span>' + state.additional.flagUrl + ' ' + state.id + ' ' + state.text + '</span>');
  }

  // function for selection template
  public templateSelection =  (state: Select2OptionData): any => {
    if (!state.id) {
      return state.text;
    }
    return jQuery('<span>' + state.additional.flagUrl + ' ' + state.id + ' ' + state.text + '</span>');
  }

  ngOnDestroy(): void {
    const selectOptionsContainer = jQuery('.select2-container');
    selectOptionsContainer.removeClass('select2-container--open')
  }

}
