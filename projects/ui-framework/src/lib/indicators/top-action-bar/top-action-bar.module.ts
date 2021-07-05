import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsModule } from '../../icons/icons.module';
import { SingleSelectPanelModule } from '../../lists/single-select-panel/single-select-panel.module';
import { TopActionBarComponent } from './top-action-bar.component';

@NgModule({
  declarations: [TopActionBarComponent],
  imports: [
      CommonModule,
      SingleSelectPanelModule,
      IconsModule
  ],
  exports: [TopActionBarComponent]
})
export class TopActionBarModule { }
