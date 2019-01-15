import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { PanelComponent } from './panel.component';

@NgModule({
  declarations: [
    PanelComponent,
  ],
  imports: [
    CommonModule,
    OverlayModule,
  ],
  exports: [
    PanelComponent,
  ],
})
export class PanelModule {
}
