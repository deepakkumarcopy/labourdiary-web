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
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		ToastrModule,
		TranslateModule,
		InfiniteScrollModule,
		NgSelectModule,
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