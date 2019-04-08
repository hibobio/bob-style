import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RichTextEditorComponent } from './rich-text-editor.component';
import { SingleSelectModule } from '../../form-elements/lists/single-select/single-select.module';
import { PanelModule } from '../../overlay/panel/panel.module';
import { InputModule } from '../../form-elements/input/input.module';
import { RteLinkEditorComponent } from './rte-link-editor/rte-link-editor.component';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { RteUtilsService } from './rte-utils/rte-utils.service';
import { IconsModule } from '../../icons/icons.module';
import { RteCapsuleComponent } from './rte-capsule/rte-capsule.component';

@NgModule({
  declarations: [
    RichTextEditorComponent,
    RteLinkEditorComponent,
    RteCapsuleComponent,
  ],
  imports: [
    CommonModule,
    SingleSelectModule,
    PanelModule,
    InputModule,
    ButtonsModule,
    IconsModule,
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

