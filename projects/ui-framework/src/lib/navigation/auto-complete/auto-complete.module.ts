import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoCompleteComponent } from './auto-complete.component';
import { SearchModule } from '../search/search.module';
import { AutoCompletePanelComponent } from './auto-complete-panel/auto-complete-panel.component';
import { PanelPositionService } from '../../overlay/panel/panel-position.service';
import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TypographyModule } from '../../typography/typography.module';
import { FiltersModule } from '../../services/filters/filters.module';
import { ListKeyboardService } from '../../form-elements/lists/list-service/list-keyboard.service';

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
    ListKeyboardService,
  ],
  exports: [
    AutoCompleteComponent,
  ],
})
export class AutoCompleteModule {
}
