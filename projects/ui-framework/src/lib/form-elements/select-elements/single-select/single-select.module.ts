import { NgModule } from '@angular/core';
import { SelectModule } from '../select/select.module';
import { SingleSelectComponent } from './single-select.component';

@NgModule({
  declarations: [
    SingleSelectComponent,
  ],
  imports: [
    SelectModule,
  ],
  exports: [
    SingleSelectComponent,
  ],
})
export class SingleSelectModule {
}
