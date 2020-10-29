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
		ChartsModule,
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