import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListOptionComponent } from './list-option.component';
import { FiltersModule } from '../../../filters/filters.module';

@NgModule({
  declarations: [
    ListOptionComponent,
  ],
  imports: [
    CommonModule,
    FiltersModule,
  ],
  exports: [
    ListOptionComponent,
  ],
  providers: [],
})
export class ListOptionModule {
}
