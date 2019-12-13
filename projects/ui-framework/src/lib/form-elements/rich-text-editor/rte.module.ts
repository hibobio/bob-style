import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RichTextEditorComponent } from './rte.component';
import { PanelModule } from '../../popups/panel/panel.module';
import { InputModule } from '../../form-elements/input/input.module';
import { RteLinkEditorComponent } from './rte-link/rte-link-editor.component';
import { ButtonsModule } from '../../buttons/buttons.module';
import { RteUtilsService } from './rte-core/rte-utils.service';
import { IconsModule } from '../../icons/icons.module';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { PlaceholderRteConverterService } from './rte-placeholder/placeholder-rte-converter.service';
import { SingleListModule } from '../../lists/single-list/single-list.module';
import { InputMessageModule } from '../input-message/input-message.module';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';

@NgModule({
  declarations: [RichTextEditorComponent, RteLinkEditorComponent],
  imports: [
    CommonModule,
    PanelModule,
    InputModule,
    ButtonsModule,
    IconsModule,
    SingleListModule,
    InputMessageModule
  ],
  exports: [RichTextEditorComponent],
  providers: [
    RteUtilsService,
    DOMhelpers,
    PlaceholderRteConverterService,
    EventManagerPlugins[0]
  ]
})
export class RichTextEditorModule {}
