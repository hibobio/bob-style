import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSearchComponent } from './multi-search.component';
import { ComponentRendererModule } from '../../services/component-renderer/component-renderer.module';
import { AvatarModule } from '../../avatar/avatar/avatar.module';
import { SearchModule } from '../search/search.module';
import { FiltersModule } from '../../services/filters/filters.module';
import { PanelPositionService } from '../../popups/panel/panel-position-service/panel-position.service';
import { ListPanelService } from '../../lists/list-panel.service';
import { OverlayModule } from '@angular/cdk/overlay';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { TruncateTooltipModule } from '../../popups/truncate-tooltip/truncate-tooltip.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [MultiSearchComponent],
  imports: [
    CommonModule,
    SearchModule,
    OverlayModule,
    ComponentRendererModule,
    AvatarModule,
    FiltersModule,
    TruncateTooltipModule,
    TranslateModule,
  ],
  exports: [MultiSearchComponent],
  providers: [PanelPositionService, ListPanelService, EventManagerPlugins[0]],
})
export class MultiSearchModule {}
