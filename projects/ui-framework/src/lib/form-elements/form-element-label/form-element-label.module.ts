import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormElementLabelComponent } from './form-element-label.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TruncateTooltipModule } from '../../popups/truncate-tooltip/truncate-tooltip.module';
import { IconsModule } from '../../icons/icons.module';

@NgModule({
  declarations: [FormElementLabelComponent],
  imports: [CommonModule, MatTooltipModule, TruncateTooltipModule],
  exports: [FormElementLabelComponent],
})
export class FormElementLabelModule {}
