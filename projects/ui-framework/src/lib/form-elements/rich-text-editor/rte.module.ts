import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RichTextEditorComponent } from './rte.component';
import { PanelModule } from '../../popups/panel/panel.module';
import { InputModule } from '../../form-elements/input/input.module';
import { RteLinkEditorComponent } from './rte-link/rte-link-editor.component';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { RteUtilsService } from './rte-core/rte-utils.service';
import { IconsModule } from '../../icons/icons.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UtilsModule } from '../../services/utils/utils.module';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';
import { PlaceholderRteConverterService } from './rte-placeholder/placeholder-rte-converter.service';
import { SingleListModule } from '../lists/single-list/single-list.module';
import { InputMessageModule } from '../input-message/input-message.module';

@NgModule({
  declarations: [RichTextEditorComponent, RteLinkEditorComponent],
  imports: [
    CommonModule,
    PanelModule,
    InputModule,
    ButtonsModule,
    IconsModule,
    MatFormFieldModule,
    UtilsModule,
    SingleListModule,
    InputMessageModule
  ],
  exports: [RichTextEditorComponent],
  providers: [RteUtilsService, DOMhelpers, PlaceholderRteConverterService]
})
export class RichTextEditorModule {}
