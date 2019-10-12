import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewListPage } from '../pages/lists/new-list/new-list';
import { IndexListPage } from '../pages/lists/index-list/index-list';

const routes: Routes = [
  { path: 'new-list', component: NewListPage },
  { path: 'lists', component: IndexListPage }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
