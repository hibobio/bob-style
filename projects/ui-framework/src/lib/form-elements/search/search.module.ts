import { NgModule } from '@angular/core';
import { SearchComponent } from './search.component';
import { CommonModule } from '@angular/common';
import { IconsModule } from '../../icons';
import { InputModule } from '../input/input.module';
import { TextareaModule } from '../textarea/textarea.module';

@NgModule({
  declarations: [
    SearchComponent,
  ],
  imports: [
    CommonModule,
    IconsModule,
    InputModule,
    TextareaModule,
  ],
  exports: [
    SearchComponent,
  ],
  providers: [],
})
export class SearchModule {
}
