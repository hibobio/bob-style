import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsModule } from '../../services/utils/utils.module';
import { UtilsService } from '../../services/utils/utils.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TruncateTooltipComponent } from './truncate-tooltip.component';
import { TruncateTooltipDirective } from './truncate-tooltip.directive';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';

@NgModule({
  imports: [CommonModule, UtilsModule, MatTooltipModule],
  declarations: [TruncateTooltipComponent, TruncateTooltipDirective],
  exports: [TruncateTooltipComponent, TruncateTooltipDirective],
  providers: [UtilsService, DOMhelpers, EventManagerPlugins[0]],
  entryComponents: [TruncateTooltipComponent]
})
export class TruncateTooltipModule {}
