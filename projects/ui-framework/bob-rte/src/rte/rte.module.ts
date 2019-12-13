import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  InputMessageModule,
  FormElementLabelModule,
  HtmlParserHelpers,
  SingleSelectPanelModule,
  ButtonsModule
} from 'bob-style';

import { RichTextEditorComponent } from './rte.component';
import { PlaceholdersConverterService } from './placeholders.service';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import 'froala-editor/js/plugins/font_size.min.js';
import 'froala-editor/js/plugins/link.min.js';
import 'froala-editor/js/plugins/align.min.js';
import 'froala-editor/js/plugins/lists.min.js';
import 'froala-editor/js/plugins/char_counter.min.js';
import 'froala-editor/js/plugins/url.min.js';
import 'froala-editor/js/plugins/emoticons.min.js';

@NgModule({
  declarations: [RichTextEditorComponent],
  imports: [
    CommonModule,
    FormElementLabelModule,
    InputMessageModule,
    SingleSelectPanelModule,
    ButtonsModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot()
  ],
  exports: [RichTextEditorComponent],
  providers: [PlaceholdersConverterService, HtmlParserHelpers]
})
export class RichTextEditorModule {}
