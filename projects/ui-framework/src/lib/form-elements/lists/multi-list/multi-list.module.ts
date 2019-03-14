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
  ],
  exports: [
    MultiListComponent,
  ],
  providers: [
    ListModelService,
    ListKeyboardService,
  ]
})
export class MultiListModule {
}
