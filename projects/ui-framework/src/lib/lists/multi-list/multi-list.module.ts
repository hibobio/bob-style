import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiListComponent } from './multi-list.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FiltersModule } from '../../services/filters/filters.module';
import { ButtonsModule } from '../../buttons/buttons.module';
import { ListFooterModule } from '../list-footer/list-footer.module';
import { SearchModule } from '../../search/search/search.module';
import { CheckboxModule } from '../../form-elements/checkbox/checkbox.module';
import { ComponentRendererModule } from '../../services/component-renderer/component-renderer.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AvatarModule } from '../../avatar/avatar/avatar.module';
import { TrackByPropModule } from '../../services/filters/trackByProp.pipe';

@NgModule({
  declarations: [MultiListComponent],
  imports: [
    CommonModule,
    ScrollingModule,
    SearchModule,
    FiltersModule,
    ButtonsModule,
    ListFooterModule,
    CheckboxModule,
    ComponentRendererModule,
    TranslateModule,
    MatTooltipModule,
    AvatarModule,
    TrackByPropModule,
  ],
  exports: [MultiListComponent],
  providers: [],
})
export class MultiListModule {}
