import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleListComponent } from './single-list.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FiltersModule } from '../../services/filters/filters.module';
import { SearchModule } from '../../search/search/search.module';
import { ComponentRendererModule } from '../../services/component-renderer/component-renderer.module';
import { ListFooterModule } from '../list-footer/list-footer.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AvatarModule } from '../../avatar/avatar/avatar.module';
import { TrackByPropModule } from '../../services/filters/trackByProp.pipe';

@NgModule({
  declarations: [SingleListComponent],
  imports: [
    CommonModule,
    ScrollingModule,
    SearchModule,
    FiltersModule,
    ComponentRendererModule,
    ListFooterModule,
    TranslateModule,
    MatTooltipModule,
    AvatarModule,
    TrackByPropModule,
  ],
  exports: [SingleListComponent],
  providers: [],
})
export class SingleListModule {}
