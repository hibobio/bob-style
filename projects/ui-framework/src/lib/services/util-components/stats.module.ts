import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DoubleClickModule } from '../utils/clickDouble.directive';
import { EventManagerPlugins } from '../utils/eventManager.plugins';
import { StatsComponent } from './stats.component';

@NgModule({
  imports: [CommonModule, DoubleClickModule],
  declarations: [StatsComponent],
  exports: [StatsComponent],
  providers: [EventManagerPlugins[0]],
})
export class StatsModule {}
