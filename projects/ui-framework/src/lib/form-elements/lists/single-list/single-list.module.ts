import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleListComponent } from './single-list.component';
import { ListModelService } from '../list-service/list-model.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SearchModule } from '../../../navigation/search/search.module';
import { FiltersModule } from '../../../services/filters/filters.module';
import { ListOptionModule } from '../list-option/list-option.module';
import { ListKeyboardService } from '../list-service/list-keyboard.service';
import { ListChangeService } from '../list-change/list-change.service';

@NgModule({
  declarations: [
    SingleListComponent,
  ],
  imports: [
    CommonModule,
    ScrollingModule,
    SearchModule,
    FiltersModule,
    ListOptionModule,
  ],
  exports: [
    SingleListComponent,
  ],
  providers: [
    ListModelService,
    ListKeyboardService,
    ListChangeService,
  ],
})
export class SingleListModule {
}
