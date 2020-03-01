import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsModule } from '../../icons/icons.module';
import { ButtonsModule } from '../../buttons/buttons.module';
import { ChainSelectComponent } from './chain-select.component';
import { ChainSelectDirective } from './chain-select.directive';

@NgModule({
  imports: [CommonModule, IconsModule, ButtonsModule],
  declarations: [ChainSelectComponent, ChainSelectDirective],
  exports: [ChainSelectComponent, ChainSelectDirective],
})
export class ChainSelectModule {}
