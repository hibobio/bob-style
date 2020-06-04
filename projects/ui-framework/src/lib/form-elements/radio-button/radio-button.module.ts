import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioButtonComponent } from './radio-button.component';
import { InputMessageModule } from '../input-message/input-message.module';
import { IconsModule } from '../../icons/icons.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TruncateTooltipModule } from '../../popups/truncate-tooltip/truncate-tooltip.module';

@NgModule({
  declarations: [RadioButtonComponent],
  imports: [
    CommonModule,
    InputMessageModule,
    IconsModule,
    MatTooltipModule,
    TruncateTooltipModule,
  ],
  exports: [RadioButtonComponent],
})
export class RadioButtonModule {}
