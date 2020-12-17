import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MetaTooltipDirective } from './meta-tooltip.directive';

@NgModule({
  imports: [MatTooltipModule],
  declarations: [MetaTooltipDirective],
  exports: [MetaTooltipDirective],
})
export class MetaTooltipModule {}
