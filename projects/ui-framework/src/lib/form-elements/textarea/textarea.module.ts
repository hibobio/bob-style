import { NgModule } from '@angular/core';
import { TextareaComponent } from './textarea.component';
import { CommonModule } from '@angular/common';
import { InputMessageModule } from '../input-message/input-message.module';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { FormElementKeyboardCntrlService } from '../services/keyboard-cntrl.service';

@NgModule({
  declarations: [TextareaComponent],
  imports: [CommonModule, InputMessageModule],
  exports: [TextareaComponent],
  providers: [EventManagerPlugins[0], FormElementKeyboardCntrlService]
})
export class TextareaModule {}
