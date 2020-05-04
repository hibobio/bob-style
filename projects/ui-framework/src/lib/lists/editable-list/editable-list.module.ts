import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditableListComponent } from './editable-list.component';
import { NgxSmoothDnDModule } from 'ngx-smooth-dnd';
import { IconsModule } from '../../icons/icons.module';
import { ButtonsModule } from '../../buttons/buttons.module';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { InputMessageModule } from '../../form-elements/input-message/input-message.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    IconsModule,
    NgxSmoothDnDModule,
    ButtonsModule,
    InputMessageModule,
    TranslateModule,
  ],
  declarations: [EditableListComponent],
  exports: [EditableListComponent],
  providers: [EventManagerPlugins[0]],
})
export class EditableListModule {}
