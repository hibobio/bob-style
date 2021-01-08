import { NgModule } from '@angular/core';
import { TextareaComponent } from './textarea.component';
import { CommonModule } from '@angular/common';
import { InputMessageModule } from '../input-message/input-message.module';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { FormElementLabelModule } from '../form-element-label/form-element-label.module';

@NgModule({
  declarations: [TextareaComponent],
  imports: [CommonModule, InputMessageModule, FormElementLabelModule],
  exports: [TextareaComponent],
  providers: [EventManagerPlugins[0]],
})
export class TextareaModule {}
