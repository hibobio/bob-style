import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarComponent } from './progress-bar.component';
import { UtilsService } from '../../../services/utils/utils.service';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';

@NgModule({
  declarations: [ProgressBarComponent],
  imports: [CommonModule],
  exports: [ProgressBarComponent],
  providers: [UtilsService, DOMhelpers],
})
export class ProgressBarModule {}
