import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionBarComponent } from './action-bar.component';
import { ButtonsModule } from '../../buttons/buttons.module';

@NgModule({
  entryComponents: [ActionBarComponent],
  declarations: [ActionBarComponent],
  imports: [
    CommonModule,
    ButtonsModule,
  ],
  exports: [ActionBarComponent],
})
export class ActionBarModule {
}
