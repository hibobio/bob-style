import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxComponent } from './checkbox.component';
import { MatPseudoCheckboxModule } from '@angular/material';

@NgModule({
  declarations: [
    CheckboxComponent,
  ],
  imports: [
    CommonModule,
    MatPseudoCheckboxModule,
  ],
  exports: [
    CheckboxComponent,
  ],
})
export class CheckboxModule {
}
