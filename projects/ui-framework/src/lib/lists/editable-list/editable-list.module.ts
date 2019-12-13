import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditableListComponent } from './editable-list.component';
import { NgxSmoothDnDModule } from 'ngx-smooth-dnd';
import { IconsModule } from '../../icons/icons.module';
import { MenuModule } from '../../navigation/menu/menu.module';
import { ButtonsModule } from '../../buttons/buttons.module';
import { EditableListService } from './editable-list.service';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';

@NgModule({
  imports: [
    CommonModule,
    IconsModule,
    NgxSmoothDnDModule,
    MenuModule,
    ButtonsModule,
  ],
  declarations: [EditableListComponent],
  exports: [EditableListComponent],
  providers: [EditableListService, EventManagerPlugins[0]],
})
export class EditableListModule {}
