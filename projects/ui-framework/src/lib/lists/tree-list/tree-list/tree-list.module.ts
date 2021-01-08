import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeListComponent } from './tree-list.component';
import { FiltersModule } from '../../../services/filters/filters.module';
import { SearchModule } from '../../../search/search/search.module';
import { ListFooterModule } from '../../list-footer/list-footer.module';

@NgModule({
  declarations: [TreeListComponent],
  imports: [CommonModule, FiltersModule, SearchModule, ListFooterModule],
  exports: [TreeListComponent],
  providers: [],
})
export class TreeListModule {}
