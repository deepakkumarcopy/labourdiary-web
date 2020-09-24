import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
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
import { HomeComponent } from './pages/home/home.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { ModalComponent } from './modal/modal.component';

//Services
import { ModalService } from './services/modal.service';
import { TranslateConfigService } from './services/translate-config.service';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		HomeComponent,
		SignUpComponent,
		ModalComponent,
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
	],
	bootstrap: [AppComponent]
})

export class AppModule { }