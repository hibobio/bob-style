import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryBookLayoutComponent } from './story-book-layout.component';
import { TypographyModule } from '../typography/typography.module';
import 'zone.js/dist/zone-patch-rxjs';
import { StatsModule } from '../services/util-components/stats.module';
import { UtilsService } from '../services/utils/utils.service';

@NgModule({
  declarations: [StoryBookLayoutComponent],
  imports: [CommonModule, TypographyModule, StatsModule],
  exports: [StoryBookLayoutComponent],
  providers: [UtilsService]
})
export class StoryBookLayoutModule {}
