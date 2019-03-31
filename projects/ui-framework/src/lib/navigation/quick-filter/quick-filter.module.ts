import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickFilterBarComponent } from './quick-filter-bar.component';
import { QuickFilterComponent } from './quick-filter.component';
import { MultiSelectModule } from '../../form-elements/lists/multi-select/multi-select.module';
import { PanelPositionService } from '../../overlay/panel/panel-position.service';
import { SingleSelectModule } from '../../form-elements/lists/single-select/single-select.module';
import { ListModelService } from '../../form-elements/lists/list-service/list-model.service';
import { ListChangeService } from '../../form-elements/lists/list-change/list-change.service';

@NgModule({
  declarations: [
    QuickFilterComponent,
    QuickFilterBarComponent,
  ],
  imports: [
    CommonModule,
    MultiSelectModule,
    SingleSelectModule,
  ],
  providers: [
    PanelPositionService,
    ListModelService,
    ListChangeService,
  ],
  exports: [
    QuickFilterComponent,
    QuickFilterBarComponent,
  ],
})
export class QuickFilterModule {
}
