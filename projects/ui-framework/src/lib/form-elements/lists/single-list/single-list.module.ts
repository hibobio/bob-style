import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleListComponent } from './single-list.component';
import { ListModelService } from '../list-service/list-model.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SearchModule } from '../../../navigation/search';
import { FiltersModule } from '../../../filters/filters.module';

@NgModule({
  declarations: [
    SingleListComponent,
  ],
  imports: [
    CommonModule,
    ScrollingModule,
    FlexLayoutModule,
    SearchModule,
    FiltersModule,
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
