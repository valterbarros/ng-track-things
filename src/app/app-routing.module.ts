import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewListPage } from '../pages/lists/new-list/new-list';
import { IndexListPage } from '../pages/lists/index-list/index-list';

import { IndexSubListPage } from '../pages/sub-lists/index-sub-list/index-sub-list';

const routes: Routes = [
  { path: 'new-list', component: NewListPage },
  { path: '', component: IndexListPage },
  { path: 'sub-lists/:listId', component: IndexSubListPage }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
