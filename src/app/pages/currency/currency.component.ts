import { Component, OnInit,Output,EventEmitter, Input , OnDestroy} from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { ToastrService } from 'ngx-toastr';
declare var jQuery:any;


@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss']
})
export class CurrencyComponent implements OnInit , OnDestroy{
  @Output() onCurrencyChange = new EventEmitter<any>();
  @Input() currencyCode: any;
  @Input() readOnly: boolean;
  @Input() width: any;

  currency: any;
  formattedCurrencyList:Array<Select2OptionData>;
  selectedCountry: any;
  public options: Options;

  constructor(private api: ApiService,
              private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // this.getAllCountry();
    this.getCurrencyCode();
    // if(this.readOnly) {
    //   this.correncySymbol = `+${this.countryCode}`;
    // }
    this.options = {
      width:this.width || "100%",
      templateResult: this.templateResult,
      templateSelection: this.templateSelection
    };
  }
  getCurrencyCode(){
    this.api.getCurrencyCode().subscribe((response) => {
      if(!!response) {
        console.log(response, 'response of currency code');
        this.currency = response.currency;
        this.formattedCurrencyList = this.api.formatCurrencyList(response.currency);
      }
    });
  }
  // getAllCountry() {
  //   this.api.getcountrycode().subscribe((response) => {
  //     if(!!response) {
  //       this.countries = response.countries;
  //       this.formattedCountryList = this.api.formatCountryList(response.countries);
  //     }
  //   });
  // }
  valueChanged(e) {
  	console.log(e, 'value changeeee')
     const fltCurrency = this.currency.find((cur) => cur.symbol === e);
     console.log(fltCurrency, 'fltCurrencyyyyyyyyyyyyyy');
     if (!!fltCurrency) {
      this.onCurrencyChange.emit({symbol:fltCurrency.symbol, code: fltCurrency.code});
     }
  }

  // function for result template
  public templateResult = (state: Select2OptionData): any => {
    if (!state.id) {
      return state.text;
    }
    return jQuery('<span>'+ state.text + '</span>');
  }

  // function for selection template
  public templateSelection =  (state: Select2OptionData): any => {
    if (!state.id) {
      return state.text;
    }
    return jQuery('<span>' +state.text + '</span>');
  }

  ngOnDestroy(): void {
    const selectOptionsContainer = jQuery('.select2-container');
    selectOptionsContainer.removeClass('select2-container--open')
  }

}
