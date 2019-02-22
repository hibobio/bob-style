import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleListComponent } from './single-list.component';
import { ListModelService } from '../list-service/list-model.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SearchModule } from '../../../navigation/search/search.module';
import { FiltersModule } from '../../../filters/filters.module';
import { ListOptionModule } from '../list-option/list-option.module';

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
  ],
})
export class SingleListModule {
}
