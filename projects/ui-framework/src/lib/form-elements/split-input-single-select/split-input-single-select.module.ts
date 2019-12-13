import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SplitInputSingleSelectComponent } from './split-input-single-select.component';
import { SingleSelectModule } from '../../lists/single-select/single-select.module';
import { InputModule } from '../input/input.module';

@NgModule({
  declarations: [
    SplitInputSingleSelectComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    InputModule,
    SingleSelectModule,
  ],
  exports: [
    SplitInputSingleSelectComponent,
  ],
})
export class SplitInputSingleSelectModule {
}
