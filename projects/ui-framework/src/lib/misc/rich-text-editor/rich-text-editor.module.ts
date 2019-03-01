import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RichTextEditorComponent } from './rich-text-editor.component';
import { SingleSelectModule } from '../../form-elements/lists/single-select/single-select.module';
import { PanelModule } from '../../overlay/panel/panel.module';
import { InputModule } from '../../form-elements/input/input.module';
import { RteLinkEditorComponent } from './rte-link-editor/rte-link-editor.component';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { RteUtilsService } from './rte-utils/rte-utils.service';

@NgModule({
  declarations: [
    RichTextEditorComponent,
    RteLinkEditorComponent,
  ],
  imports: [
    CommonModule,
    SingleSelectModule,
    PanelModule,
    InputModule,
    ButtonsModule,
  ],
  exports: [
    RichTextEditorComponent,
  ],
  providers: [
    RteUtilsService,
  ],
})
export class RichTextEditorModule {
}

