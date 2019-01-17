import { NgModule } from '@angular/core';
import { SearchComponent } from './search.component';
import { CommonModule } from '@angular/common';
import { IconsModule } from '../../icons';
import { InputModule } from '../input';

@NgModule({
  declarations: [
    SearchComponent,
  ],
  imports: [
    CommonModule,
    IconsModule,
    InputModule
  ],
  exports: [
    SearchComponent,
  ],
  providers: [],
})
export class SearchModule {
}
