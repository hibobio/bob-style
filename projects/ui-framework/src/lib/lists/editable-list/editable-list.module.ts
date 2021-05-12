import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonsModule } from '../../buttons/buttons.module';
import { InputMessageModule } from '../../form-elements/input-message/input-message.module';
import { IconsModule } from '../../icons/icons.module';
import { MenuModule } from '../../navigation/menu/menu.module';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { EditableListComponent } from './editable-list.component';

@NgModule({
  imports: [
    CommonModule,
    IconsModule,
    ButtonsModule,
    InputMessageModule,
    TranslateModule,
    DragDropModule,
    FormsModule,
    MenuModule,
  ],
  declarations: [EditableListComponent],
  exports: [EditableListComponent],
  providers: [EventManagerPlugins[0]],
})
export class EditableListModule {}
