import { NgModule } from '@angular/core';
import { SelectAndViewComponent } from './select-and-view.component';
import { SingleListModule } from '../single-list/single-list.module';
import { CommonModule } from '@angular/common';
import { IconsModule } from '../../icons/icons.module';
import { TrackByPropModule } from '../../services/filters/trackByProp.pipe';

@NgModule({
  declarations: [SelectAndViewComponent],
  imports: [
    CommonModule,
    SingleListModule,
    IconsModule,
    TrackByPropModule
  ],
  exports: [SelectAndViewComponent]
})
export class SelectAndViewModule {}
