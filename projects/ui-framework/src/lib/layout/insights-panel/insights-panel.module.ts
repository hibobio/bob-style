import { NgModule } from '@angular/core';
import { InsightsPanelComponent } from './insights-panel.component';
import { CommonModule } from '@angular/common';
import { ButtonsModule, IconsModule, ReadMoreModule, TrackByPropModule, TypographyModule } from 'bob-style';

@NgModule({
  imports: [
    CommonModule,
    IconsModule,
    ReadMoreModule,
    ButtonsModule,
    TypographyModule,
    TrackByPropModule,
  ],
  declarations: [InsightsPanelComponent],
  exports: [InsightsPanelComponent]
})
export class InsightsPanelModule {
}
