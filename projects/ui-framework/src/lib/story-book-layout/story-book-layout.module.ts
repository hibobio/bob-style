import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryBookLayoutComponent } from './story-book-layout.component';
import { TypographyModule } from '../typography/typography.module';
import 'zone.js/dist/zone-patch-rxjs';
import { StatsModule } from '../services/util-components/stats.module';
import { UtilsService } from '../services/utils/utils.service';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material';

@NgModule({
  declarations: [StoryBookLayoutComponent],
  imports: [CommonModule, TypographyModule, StatsModule],
  exports: [StoryBookLayoutComponent],
  providers: [UtilsService, {
    provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: {
      showDelay: 300,
      position: 'above'} }]
})
export class StoryBookLayoutModule {}
