import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../../services/utils/utils.service';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import { MultiProgressBarComponent } from './multi-progress-bar.component';
import { EventManagerPlugins } from '../../../services/utils/eventManager.plugins';

@NgModule({
  declarations: [MultiProgressBarComponent],
  imports: [CommonModule],
  exports: [MultiProgressBarComponent],
  providers: [UtilsService, DOMhelpers, EventManagerPlugins[0]],
})
export class MultiProgressBarModule {}
