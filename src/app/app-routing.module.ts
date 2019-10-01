import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewListPage } from '../pages/lists/new-list/new-list'

const routes: Routes = [
  { path: 'new-list', component: NewListPage }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
