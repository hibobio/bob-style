import { NgModule } from '@angular/core';
import { SelectAndViewComponent } from './select-and-view.component';
import { SingleListModule } from '../single-list/single-list.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [SelectAndViewComponent],
  imports: [
    CommonModule,
    SingleListModule,
  ],
  exports: [SelectAndViewComponent]
})
export class SelectAndViewModule {}
