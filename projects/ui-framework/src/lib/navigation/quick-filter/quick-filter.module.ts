import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickFilterBarComponent } from './quick-filter-bar.component';
import { QuickFilterComponent } from './quick-filter.component';
import { MultiSelectModule } from '../../form-elements/lists/multi-select/multi-select.module';
import { PanelPositionService } from '../../overlay/panel/panel-position.service';

@NgModule({
  declarations: [
    QuickFilterComponent,
    QuickFilterBarComponent,
  ],
  imports: [
    CommonModule,
    MultiSelectModule,
  ],
  providers: [
    PanelPositionService,
  ],
  exports: [
    QuickFilterComponent,
    QuickFilterBarComponent,
  ],
})
export class QuickFilterModule {
}
