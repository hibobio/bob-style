import { IconsModule, SingleSelectPanelModule } from 'bob-style';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
