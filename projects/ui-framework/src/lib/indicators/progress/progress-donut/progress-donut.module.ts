import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressDonutComponent } from './progress-donut.component';
import { UtilsService } from '../../../services/utils/utils.service';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';

@NgModule({
  declarations: [ProgressDonutComponent],
  imports: [CommonModule],
  exports: [ProgressDonutComponent],
  providers: [UtilsService, DOMhelpers],
})
export class ProgressDonutModule {}
