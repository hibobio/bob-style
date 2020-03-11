import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeListComponent } from './tree-list.component';
import { TreeListModelService } from '../services/tree-list-model.service';
import { FiltersModule } from '../../../services/filters/filters.module';
import { SearchModule } from '../../../search/search/search.module';
import { ListFooterModule } from '../../list-footer/list-footer.module';
import { TreeListControlsService } from '../services/tree-list-controls.service';
import { TreeListViewService } from '../services/tree-list-view.service';
import { TreeListValueService } from '../services/tree-list-value.service';
import { TreeListSearchService } from '../services/tree-list-search.service';

@NgModule({
  declarations: [TreeListComponent],
  imports: [CommonModule, FiltersModule, SearchModule, ListFooterModule],
  exports: [TreeListComponent],
  providers: [
    TreeListModelService,
    TreeListViewService,
    TreeListControlsService,
    TreeListValueService,
    TreeListSearchService,
  ],
})
export class TreeListModule {}
