import { NgModule } from '@angular/core';
import { InsightsPanelComponent } from './insights-panel.component';
import { CommonModule } from '@angular/common';
import { ButtonsModule, IconsModule, ReadMoreModule, TypographyModule } from 'bob-style';

@NgModule({
  imports: [
    CommonModule,
    IconsModule,
    ReadMoreModule,
    ButtonsModule,
    TypographyModule,
  ],
  declarations: [InsightsPanelComponent],
  exports: [InsightsPanelComponent]
})
export class InsightsPanelModule {
}
