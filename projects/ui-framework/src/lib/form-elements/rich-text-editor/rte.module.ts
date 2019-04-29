import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RichTextEditorComponent } from './rte.component';
import { PanelModule } from '../../overlay/panel/panel.module';
import { InputModule } from '../../form-elements/input/input.module';
import { RteLinkEditorComponent } from './rte-link-editor/rte-link-editor.component';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { RteUtilsService } from './rte-utils/rte-utils.service';
import { IconsModule } from '../../icons/icons.module';
import { MatFormFieldModule } from '@angular/material';
import { UtilsModule } from '../../services/utils/utils.module';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';

@NgModule({
  declarations: [RichTextEditorComponent, RteLinkEditorComponent],
  imports: [
    CommonModule,
    PanelModule,
    InputModule,
    ButtonsModule,
    IconsModule,
    MatFormFieldModule,
    UtilsModule
  ],
  exports: [RichTextEditorComponent],
  providers: [RteUtilsService, DOMhelpers]
})
export class RichTextEditorModule {}
