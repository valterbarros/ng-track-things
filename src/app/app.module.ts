import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewListPage } from '../pages/lists/new-list/new-list';
import { IndexListPage } from '../pages/lists/index-list/index-list';
import { CardComponent } from '../pages/lists/index-list/card/card.component'

import { IndexSubListPage } from '../pages/sub-lists/index-sub-list/index-sub-list';

import { FixForCssVarsDirective } from './fix-for-css-vars.directive';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from './app.effects';
import { ListContentDirective } from './list-content.directive';
import { CardSubListComponent } from '../pages/sub-lists/index-sub-list/card-sub-list/card-sub-list.component';
import { CreateNewCardButtonComponent } from '../pages/sub-lists/index-sub-list/create-new-card-button/create-new-card-button.component';
import { CreateNewCardComponent } from 'src/pages/sub-lists/index-sub-list/create-new-card/create-new-card.component';

@NgModule({
  declarations: [
    AppComponent,
    NewListPage,
    IndexListPage,
    IndexSubListPage,
    CardComponent,
    CardSubListComponent,
    FixForCssVarsDirective,
    ListContentDirective,
    CreateNewCardButtonComponent,
    CreateNewCardComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    EffectsModule.forRoot([AppEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {}
