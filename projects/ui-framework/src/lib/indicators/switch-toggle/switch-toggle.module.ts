import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwitchToggleComponent } from './switch-toggle.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { InputMessageModule } from '../../form-elements/input-message/input-message.module';

@NgModule({
  declarations: [SwitchToggleComponent],
  imports: [CommonModule, MatSlideToggleModule, InputMessageModule],
  exports: [SwitchToggleComponent],
})
export class SwitchToggleModule {}
