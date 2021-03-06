import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule, TranslateLoader, MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireModule } from "@angular/fire";
import { environment } from '../environments/environment.prod';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ChartsModule } from 'ng2-charts';
import { NgSelect2Module } from 'ng-select2';
import { ImageCropperModule } from 'ngx-image-cropper';

//Component
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/user/home/home.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { ModalComponent } from './modal/modal.component';

//Services
import { ModalService } from './services/modal.service';
import { TranslateConfigService } from './services/translate-config.service';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { SearchComponent } from './pages/user/search/search.component';
import { FooterComponent } from './pages/footer/footer.component';
import { HeaderComponent } from './pages/user/header/header.component';
import { CategoryComponent } from './pages/user/category/category.component';
import { ErrorComponent } from './pages/error/error.component';
import { ServiceComponent } from './pages/user/service/service.component';
import { UserComponent } from './layouts/user/user.component';
import { CommonLoaderComponent } from './shared/common-loader/common-loader.component';
import { OrderConfirmationComponent } from './pages/user/order-confirmation/order-confirmation.component';
import { DpDatePickerModule } from 'ng2-date-picker';
import { PaymentComponent } from './pages/user/payment/payment.component';
import { MessagesComponent } from './pages/user/messages/messages.component';
import { MyOrderComponent } from './pages/user/my-order/my-order.component';
import { ServiceProviderComponent } from './layouts/service-provider/service-provider.component';
import { StatsComponent } from './pages/service-provider/stats/stats.component';
import { ServiceHeaderComponent } from './pages/service-provider/service-header/service-header.component';
import { InboxComponent } from './pages/service-provider/inbox/inbox.component';
import { ListingComponent } from './pages/service-provider/listing/listing.component';
import { CalenderComponent } from './pages/service-provider/calender/calender.component';
import { JobsComponent } from './pages/service-provider/jobs/jobs.component';
import { PerformanceComponent } from './layouts/performance/performance.component';
import { ViewsAndBookingsComponent } from './pages/service-provider/performance-header/views-and-bookings/views-and-bookings.component';
import { EarningComponent } from './pages/service-provider/performance-header/earning/earning.component';
import { ReviewsComponent } from './pages/service-provider/performance-header/reviews/reviews.component';
import { PerformanceHeaderComponent } from './pages/service-provider/performance-header/performance-header.component';
import { PrivateInformationComponent } from './pages/service-provider/private-information/private-information.component';
import { EmergencyContactComponent } from './pages/service-provider/emergency-contact/emergency-contact.component';
import { CountryInputComponent } from './pages/country-input/country-input.component';
import { WorkInformationComponent } from './pages/service-provider/work-information/work-information.component';
import { BusinessInformationComponent } from './pages/service-provider/business-information/business-information.component';
import { ServicerProviderBreadCrumbComponent } from './pages/service-provider/servicer-provider-bread-crumb/servicer-provider-bread-crumb.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ListOfServicesComponent } from './pages/service-provider/list-of-services/list-of-services.component';
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';
import { VerifyComponent } from './pages/verify/verify.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { CurrencyComponent } from './pages/currency/currency.component';
import { OrderComponent } from './pages/user/order/order.component';
import { JobDetailsComponent } from './pages/service-provider/job-details/job-details.component';

var connectionOptions = {
	"force new connection": true,
	"reconnectionAttempts": "Infinity",
	"timeout": 10000,
	"transports": ["websocket"]
};

const config: SocketIoConfig = { url: `${environment.baseUrl}:3000`, options: connectionOptions };

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		HomeComponent,
		SignUpComponent,
		ModalComponent,
		SearchComponent,
		FooterComponent,
		HeaderComponent,
		CategoryComponent,
		ErrorComponent,
		ServiceComponent,
		UserComponent,
		CommonLoaderComponent,
		OrderConfirmationComponent,
		PaymentComponent,
		MessagesComponent,
		MyOrderComponent,
		ServiceProviderComponent,
		StatsComponent,
		ServiceHeaderComponent,
		InboxComponent,
		ListingComponent,
		CalenderComponent,
		JobsComponent,
		PerformanceComponent,
		ReviewsComponent,
		ViewsAndBookingsComponent,
		EarningComponent,
		PerformanceHeaderComponent,
		PrivateInformationComponent,
		EmergencyContactComponent,
		CountryInputComponent,
		WorkInformationComponent,
		BusinessInformationComponent,
		ServicerProviderBreadCrumbComponent,
		ProfileComponent,
		ListOfServicesComponent,
		ConfirmationDialogComponent,
		VerifyComponent,
		ForgetPasswordComponent,
		CurrencyComponent,
		OrderComponent,
		JobDetailsComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		ToastrModule.forRoot({ preventDuplicates: true, positionClass: 'toast-top-right' }),
		TranslateModule,
		InfiniteScrollModule,
		NgSelectModule,
		MatFormFieldModule,
		MatAutocompleteModule,
		MatInputModule,
		BrowserAnimationsModule,
		DpDatePickerModule,
		ImageCropperModule,
		ChartsModule,
		NgSelect2Module,
		SocketIoModule.forRoot(config),
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useClass: TranslateConfigService,
				deps: [HttpClient]
			}
		}),
		AngularFireModule.initializeApp(environment.firebaseConfig),
		AngularFireAuthModule,
	],
	providers: [
		ModalService,
		TranslateConfigService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: TokenInterceptorService,
			multi: true
		}
	],
	bootstrap: [AppComponent]
})

export class AppModule { }