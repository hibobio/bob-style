import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelExampleComponent } from './panel-example.component';
import { PanelModule } from '../panel/panel.module';
import { ButtonsModule } from '../../buttons';

@NgModule({
  declarations: [
    PanelExampleComponent,
  ],
  imports: [
    CommonModule,
    PanelModule,
    ButtonsModule,
  ],
  exports: [
    PanelExampleComponent,
  ],
})
export class PanelExampleModule {
}
