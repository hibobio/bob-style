import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleListComponent } from './single-list.component';
import { ListModelService } from '../list-service/list-model.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FiltersModule } from '../../services/filters/filters.module';
import { ListKeyboardService } from '../list-service/list-keyboard.service';
import { ListChangeService } from '../list-change/list-change.service';
import { SearchModule } from '../../search/search/search.module';
import { ComponentRendererModule } from '../../services/component-renderer/component-renderer.module';
import { ListFooterModule } from '../list-footer/list-footer.module';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';

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
  ],
  exports: [SingleListComponent],
  providers: [
    ListModelService,
    ListKeyboardService,
    ListChangeService,
    DOMhelpers,
  ],
})
export class SingleListModule {}
