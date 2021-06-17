import 'froala-editor/js/plugins/align.min.js';
import 'froala-editor/js/plugins/emoticons.min.js';
import 'froala-editor/js/plugins/font_size.min.js';
// import 'froala-editor/js/plugins/link.min.js';
import './froala/link.min.js';
import 'froala-editor/js/plugins/lists.min.js';
import 'froala-editor/js/plugins/url.min.js';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

import {
  ButtonsModule,
  EventManagerPlugins,
  FormElementLabelModule,
  InputMessageModule,
  SingleSelectPanelModule,
} from 'bob-style';

import { RichTextEditorComponent } from './rte.component';

@NgModule({
  declarations: [RichTextEditorComponent],
  imports: [
    CommonModule,
    FormElementLabelModule,
    InputMessageModule,
    SingleSelectPanelModule,
    ButtonsModule,
    TranslateModule,
    MatTooltipModule,
  ],
  exports: [RichTextEditorComponent],
  providers: [EventManagerPlugins[0]],
})
export class RichTextEditorModule {}
