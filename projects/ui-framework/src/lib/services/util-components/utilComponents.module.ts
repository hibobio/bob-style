import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockComponent } from './mock.component';
import { UtilsModule } from '../utils/utils.module';
import { DOMhelpers } from '../utils/dom-helpers.service';
import { StatsComponent } from './stats.component';
import { EventManagerPlugins } from '../utils/eventManager.plugins';

@NgModule({
  imports: [CommonModule, UtilsModule],
  declarations: [MockComponent, StatsComponent],
  exports: [MockComponent, StatsComponent],
  providers: [DOMhelpers, EventManagerPlugins[0]]
})
export class UtilComponentsModule {}
