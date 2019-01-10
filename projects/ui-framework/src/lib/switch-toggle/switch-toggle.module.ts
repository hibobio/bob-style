import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwitchToggleComponent } from './switch-toggle.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [SwitchToggleComponent],
  imports: [
    CommonModule,
    MatSlideToggleModule
  ],
  exports: [SwitchToggleComponent],
})
export class SwitchToggleModule {
}
