import { NgModule } from '@angular/core';
import { PasswordInputComponent } from './password-input.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { IconsModule } from '../../icons/icons.module';
import { CommonModule } from '@angular/common';
import { InputMessageModule } from '../input-message/input-message.module';

@NgModule({
  declarations: [PasswordInputComponent],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    IconsModule,
    InputMessageModule
  ],
  exports: [PasswordInputComponent],
  entryComponents: [],
  providers: []
})
export class PasswordInputModule {}
