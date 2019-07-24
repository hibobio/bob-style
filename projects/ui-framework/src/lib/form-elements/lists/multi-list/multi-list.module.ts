import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiListComponent } from './multi-list.component';
import { ListModelService } from '../list-service/list-model.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FiltersModule } from '../../../services/filters/filters.module';
import { ListOptionModule } from '../list-option/list-option.module';
import { ListKeyboardService } from '../list-service/list-keyboard.service';
import { ListChangeService } from '../list-change/list-change.service';
import { ButtonsModule } from '../../../buttons-indicators/buttons/buttons.module';
import { ListFooterModule } from '../list-footer/list-footer.module';
import { SearchModule } from '../../../search/search/search.module';
import { CheckboxModule } from '../../checkbox/checkbox.module';

@NgModule({
  declarations: [
    MultiListComponent,
  ],
  imports: [
    CommonModule,
    ScrollingModule,
    SearchModule,
    FiltersModule,
    ListOptionModule,
    ButtonsModule,
    ListFooterModule,
    CheckboxModule,
  ],
  exports: [
    MultiListComponent,
  ],
  providers: [
    ListModelService,
    ListChangeService,
    ListKeyboardService,
  ],
})
export class MultiListModule {}
