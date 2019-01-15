import { NgModule } from '@angular/core';
import { MultiSelectComponent } from './multi-select.component';
import { SelectModule } from '../select/select.module';

@NgModule({
  declarations: [
    MultiSelectComponent,
  ],
  imports: [
    SelectModule,
  ],
  exports: [
    MultiSelectComponent,
  ],
})
export class MultiSelectModule {
}
