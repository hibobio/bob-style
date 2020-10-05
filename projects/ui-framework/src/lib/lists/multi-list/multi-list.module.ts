import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiListComponent } from './multi-list.component';
import { ListModelService } from '../list-service/list-model.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FiltersModule } from '../../services/filters/filters.module';
import { ListKeyboardService } from '../list-service/list-keyboard.service';
import { ListChangeService } from '../list-change/list-change.service';
import { ButtonsModule } from '../../buttons/buttons.module';
import { ListFooterModule } from '../list-footer/list-footer.module';
import { SearchModule } from '../../search/search/search.module';
import { CheckboxModule } from '../../form-elements/checkbox/checkbox.module';
import { ComponentRendererModule } from '../../services/component-renderer/component-renderer.module';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';

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
  ],
  exports: [MultiListComponent],
  providers: [
    ListModelService,
    ListChangeService,
    ListKeyboardService,
    DOMhelpers,
  ],
})
export class MultiListModule {}
