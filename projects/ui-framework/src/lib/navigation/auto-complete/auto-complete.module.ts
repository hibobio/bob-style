import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoCompleteComponent } from './auto-complete.component';
import { SearchModule } from '../search/search.module';
import { AutoCompletePanelComponent } from './auto-complete-panel/auto-complete-panel.component';
import { PanelPositionService } from '../../overlay/panel/panel-position.service';
import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TypographyModule } from '../../typography/typography.module';
import { FiltersModule } from '../../filters/filters.module';

@NgModule({
  declarations: [
    AutoCompleteComponent,
    AutoCompletePanelComponent,
  ],
  imports: [
    CommonModule,
    SearchModule,
    OverlayModule,
    ScrollingModule,
    TypographyModule,
    FiltersModule,
  ],
  providers: [
    PanelPositionService,
  ],
  exports: [
    AutoCompleteComponent,
  ],
})
export class AutoCompleteModule {
}
