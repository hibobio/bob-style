import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickFilterBarComponent } from './quick-filter-bar.component';
import { QuickFilterComponent } from './quick-filter.component';
import { MultiSelectModule } from '../../lists/multi-select/multi-select.module';
import { SingleSelectModule } from '../../lists/single-select/single-select.module';
import { IconsModule } from '../../icons/icons.module';

@NgModule({
  declarations: [QuickFilterComponent, QuickFilterBarComponent],
  imports: [CommonModule, MultiSelectModule, SingleSelectModule, IconsModule],
  providers: [],
  exports: [QuickFilterComponent, QuickFilterBarComponent],
})
export class QuickFilterModule {}
