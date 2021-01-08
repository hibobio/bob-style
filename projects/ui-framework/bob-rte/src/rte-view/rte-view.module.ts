import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RteViewComponent } from './rte-view.component';
import { PlaceholdersConverterService } from '../rte/placeholders.service';
import { EventManagerPlugins } from 'bob-style';

@NgModule({
  declarations: [RteViewComponent],
  imports: [CommonModule],
  exports: [RteViewComponent],
  providers: [EventManagerPlugins[0]],
})
export class RteViewModule {}
