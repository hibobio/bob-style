import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiProgressBarComponent } from './multi-progress-bar.component';
import { EventManagerPlugins } from '../../../services/utils/eventManager.plugins';

@NgModule({
  declarations: [MultiProgressBarComponent],
  imports: [CommonModule],
  exports: [MultiProgressBarComponent],
  providers: [EventManagerPlugins[0]],
})
export class MultiProgressBarModule {}
