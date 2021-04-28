import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditableListComponent } from './editable-list.component';
import { IconsModule } from '../../icons/icons.module';
import { ButtonsModule } from '../../buttons/buttons.module';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { InputMessageModule } from '../../form-elements/input-message/input-message.module';
import { TranslateModule } from '@ngx-translate/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    CommonModule,
    IconsModule,
    ButtonsModule,
    InputMessageModule,
    TranslateModule,
    DragDropModule
  ],
  declarations: [EditableListComponent],
  exports: [EditableListComponent],
  providers: [EventManagerPlugins[0]],
})
export class EditableListModule {}
