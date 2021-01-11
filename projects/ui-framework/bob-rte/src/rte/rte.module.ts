import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  InputMessageModule,
  FormElementLabelModule,
  SingleSelectPanelModule,
  ButtonsModule,
  EventManagerPlugins,
} from 'bob-style';
import { RichTextEditorComponent } from './rte.component';
import { FroalaEditorDirective } from './froala/editor.directive';
import { FroalaViewDirective } from './froala/view.directive';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';

import 'froala-editor/js/plugins/font_size.min.js';
import 'froala-editor/js/plugins/link.min.js';
import 'froala-editor/js/plugins/align.min.js';
import 'froala-editor/js/plugins/lists.min.js';
// import 'froala-editor/js/plugins/char_counter.min.js';
import 'froala-editor/js/plugins/url.min.js';
import 'froala-editor/js/plugins/emoticons.min.js';

@NgModule({
  declarations: [
    FroalaEditorDirective,
    FroalaViewDirective,
    RichTextEditorComponent,
  ],
  imports: [
    CommonModule,
    FormElementLabelModule,
    InputMessageModule,
    SingleSelectPanelModule,
    ButtonsModule,
    TranslateModule,
    MatTooltipModule,
  ],
  exports: [
    FroalaEditorDirective,
    FroalaViewDirective,
    RichTextEditorComponent,
  ],
  providers: [EventManagerPlugins[0]],
})
export class RichTextEditorModule {}
