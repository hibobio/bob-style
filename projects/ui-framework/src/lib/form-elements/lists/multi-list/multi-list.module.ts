import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiListComponent } from './multi-list.component';
import { ListModelService } from '../list-service/list-model.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatPseudoCheckboxModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SearchModule } from '../../../navigation/search';
import { FiltersModule } from '../../../filters/filters.module';

@NgModule({
  declarations: [
    MultiListComponent,
  ],
  imports: [
    CommonModule,
    ScrollingModule,
    FlexLayoutModule,
    MatPseudoCheckboxModule,
    SearchModule,
    FiltersModule,
  ],
  exports: [
    MultiListComponent,
  ],
  providers: [
    ListModelService,
  ],
})
export class MultiListModule {
}
