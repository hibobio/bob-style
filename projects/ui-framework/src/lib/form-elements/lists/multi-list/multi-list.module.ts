import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiListComponent } from './multi-list.component';
import { ListModelService } from '../list-service/list-model.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatPseudoCheckboxModule } from '@angular/material';
import { SearchModule } from '../../../navigation/search/search.module';
import { FiltersModule } from '../../../services/filters/filters.module';
import { ListOptionModule } from '../list-option/list-option.module';
import { ListKeyboardService } from '../list-service/list-keyboard.service';
import { ListChangeService } from '../list-change/list-change.service';
import { ButtonsModule } from '../../../buttons-indicators/buttons/buttons.module';
import { ListFooterModule } from '../list-footer/list-footer.module';

@NgModule({
  declarations: [
    MultiListComponent,
  ],
  imports: [
    CommonModule,
    ScrollingModule,
    MatPseudoCheckboxModule,
    SearchModule,
    FiltersModule,
    ListOptionModule,
    ButtonsModule,
    ListFooterModule,
  ],
  exports: [
    MultiListComponent,
  ],
  providers: [
    ListModelService,
    ListChangeService,
    ListKeyboardService,
  ]
})
export class MultiListModule {
}
