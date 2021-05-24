import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { SearchModule } from '../search/search.module';
import { CompactSearchComponent } from './compact-search.component';

@NgModule({
  declarations: [CompactSearchComponent],
  exports: [CompactSearchComponent],
  imports: [CommonModule, SearchModule],
  providers: [EventManagerPlugins[0]],
})
export class CompactSearchModule {}
