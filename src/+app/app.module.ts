import { NgModule } from '@angular/core';

import { MomentModule } from 'angular2-moment';
import { BemModule } from 'angular-bem';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';

import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import { routing, appRoutingProviders }  from './app.routing';
import { AuthService, AuthModule } from './auth';

import { MBootstrapModule } from './helpers/bootstrap-components/MBootstrapModule.module';
import { SharedModule } from './shared/shared.module';
import { NavigationModule } from './Navigation';

import { MainPageComponent } from "./MainPage";
import { ErrorPage } from "./pages/error-page.component";
import { AboutControlio } from './pages/about_controlio.component';

import { UserModule } from './users';

@NgModule({
  imports:      [
    AuthModule.forRoot(),
    SharedModule,
    routing,
    MomentModule,
    BemModule,
    MBootstrapModule,
    InfiniteScrollModule,
    NavigationModule,
    UserModule
  ],
  declarations: [
    AppComponent,
    MainPageComponent,
    ErrorPage,
    AboutControlio,

  ],
  providers: [
    appRoutingProviders,
    CookieService,
    AppConfig
  ]
})
export class AppModule { }
export { AppComponent } from './app.component';
