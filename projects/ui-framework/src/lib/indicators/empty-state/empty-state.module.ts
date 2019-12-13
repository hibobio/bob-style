import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyStateComponent } from './empty-state.component';
import {IconsModule} from '../../icons/icons.module';
import {ButtonsModule} from '../../buttons/buttons.module';

@NgModule({
  declarations: [EmptyStateComponent],
  imports: [
    CommonModule,
    IconsModule,
    ButtonsModule,
  ],
  exports: [EmptyStateComponent],
})
export class EmptyStateModule { }
