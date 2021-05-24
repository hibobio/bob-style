import { NgModule } from '@angular/core';
import { SelectAndViewComponent } from './select-and-view.component';
import { SingleListModule } from '../single-list/single-list.module';
import { CommonModule } from '@angular/common';
import { IconsModule } from '../../icons/icons.module';
import { TrackByPropModule } from '../../services/filters/trackByProp.pipe';
import { EmptyStateModule } from '../../indicators/empty-state/empty-state.module';
import { SearchModule } from '../../search/search/search.module';
import { TranslateModule } from '@ngx-translate/core';
import { FiltersModule } from '../../services/filters/filters.module';
import { NgLetModule } from '../../services/utils/nglet.directive';

@NgModule({
  declarations: [SelectAndViewComponent],
  imports: [
    CommonModule,
    SingleListModule,
    IconsModule,
    TrackByPropModule,
    EmptyStateModule,
    SearchModule,
    TranslateModule,
    FiltersModule,
    NgLetModule
  ],
  exports: [SelectAndViewComponent]
})
export class SelectAndViewModule {}
