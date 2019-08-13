import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormElementsTestComponent } from './form-elements/form-elements.component';
import { UtilsComponent } from './utils/utils.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'form-elements',
    pathMatch: 'full',
  },
  {
    path: 'form',
    component: FormElementsTestComponent,
  },
  {
    path: 'utils',
    component: UtilsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
