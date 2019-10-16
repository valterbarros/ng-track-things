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

@NgModule({
  declarations: [
    AppComponent,
    NewListPage,
    IndexListPage,
    IndexSubListPage,
    CardComponent,
    FixForCssVarsDirective
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {}
