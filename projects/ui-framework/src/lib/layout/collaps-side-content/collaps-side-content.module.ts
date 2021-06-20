import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconsModule } from 'bob-style';
import { CollapsSideContentComponent } from './collaps-side-content.component';

@NgModule({
  imports: [
    IconsModule, CommonModule,
  ],
  exports: [CollapsSideContentComponent],
  declarations: [CollapsSideContentComponent],
  providers: [],
})
export class CollapsSideContentModule {
}
