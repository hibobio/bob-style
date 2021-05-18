import { NgModule } from '@angular/core';
import { SelectAndViewComponent } from './select-and-view.component';
import { SingleListModule } from '../single-list/single-list.module';
import { CommonModule } from '@angular/common';
import { IconsModule } from '../../icons/icons.module';

@NgModule({
  declarations: [SelectAndViewComponent],
  imports: [
    CommonModule,
    SingleListModule,
    IconsModule,
  ],
  exports: [SelectAndViewComponent]
})
export class SelectAndViewModule {}
