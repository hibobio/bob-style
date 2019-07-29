import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChainSelectComponent } from './chain-select.component';
import { IconsModule } from '../../../icons/icons.module';
import {
  ComponentRendererModule
} from '../../../services/component-renderer/component-renderer.module';
import { ButtonsModule } from '../../../buttons-indicators/buttons/buttons.module';

@NgModule({
  imports: [
    CommonModule,
    IconsModule,
    ComponentRendererModule,
    ButtonsModule,
  ],
  declarations: [
    ChainSelectComponent,
  ],
  exports: [
    ChainSelectComponent,
  ],
})
export class ChainSelectModule { }
