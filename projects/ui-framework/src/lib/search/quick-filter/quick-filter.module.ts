import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickFilterBarComponent } from './quick-filter-bar.component';
import { QuickFilterComponent } from './quick-filter.component';
import { MultiSelectModule } from '../../lists/multi-select/multi-select.module';
import { SingleSelectModule } from '../../lists/single-select/single-select.module';
import { ListModelService } from '../../lists/list-service/list-model.service';
import { ListChangeService } from '../../lists/list-change/list-change.service';
import { IconsModule } from '../../icons/icons.module';
import { DOMhelpers } from '../../services/html/dom-helpers.service';

@NgModule({
  declarations: [QuickFilterComponent, QuickFilterBarComponent],
  imports: [CommonModule, MultiSelectModule, SingleSelectModule, IconsModule],
  providers: [ListModelService, ListChangeService, DOMhelpers],
  exports: [QuickFilterComponent, QuickFilterBarComponent],
})
export class QuickFilterModule {}
