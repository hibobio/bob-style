import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormElementsTestComponent } from './form-elements/form-elements.component';
import { UtilsComponent } from './utils/utils.component';
import { TreeListTestComponent } from './tree-list/tree-list.component';
import { TestTableComponent } from './test-table/test-table.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'table',
    pathMatch: 'full',
  },
  {
    path: 'table',
    component: TestTableComponent,
  },
  {
    path: 'tree-list',
    component: TreeListTestComponent,
  },
  {
    path: 'form',
    component: FormElementsTestComponent,
  },
  {
    path: 'utils',
    component: UtilsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor() {}
}
