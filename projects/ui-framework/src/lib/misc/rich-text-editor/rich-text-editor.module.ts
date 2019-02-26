import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RichTextEditorComponent } from './rich-text-editor.component';
import { SingleSelectModule } from '../../form-elements/lists/single-select/single-select.module';

@NgModule({
  declarations: [
    RichTextEditorComponent,
  ],
  imports: [
    CommonModule,
    SingleSelectModule,
  ],
  exports: [
    RichTextEditorComponent,
  ],
  providers: [],
})
export class RichTextEditorModule {
}
