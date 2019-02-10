import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiListComponent } from './multi-list-component';
import { ListModelService } from '../list-service/list-model.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatOptionModule, MatPseudoCheckboxModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    MultiListComponent,
  ],
  imports: [
    CommonModule,
    ScrollingModule,
    MatOptionModule,
    FlexLayoutModule,
    MatPseudoCheckboxModule,
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
