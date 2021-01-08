import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoCompleteComponent } from './auto-complete.component';
import { AutoCompletePanelComponent } from './auto-complete-panel/auto-complete-panel.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TypographyModule } from '../../typography/typography.module';
import { FiltersModule } from '../../services/filters/filters.module';
import { SearchModule } from '../search/search.module';

@NgModule({
  declarations: [AutoCompleteComponent, AutoCompletePanelComponent],
  imports: [
    CommonModule,
    SearchModule,
    OverlayModule,
    ScrollingModule,
    TypographyModule,
    FiltersModule,
  ],
  providers: [],
  exports: [AutoCompleteComponent],
})
export class AutoCompleteModule {}
