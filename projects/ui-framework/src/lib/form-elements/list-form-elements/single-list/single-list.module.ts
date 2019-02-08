import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleListComponent } from './single-list-component';
import { ListModelService } from '../list-service/list-model.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatOptionModule } from '@angular/material';

@NgModule({
  declarations: [
    SingleListComponent,
  ],
  imports: [
    CommonModule,
    ScrollingModule,
    MatOptionModule,
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
