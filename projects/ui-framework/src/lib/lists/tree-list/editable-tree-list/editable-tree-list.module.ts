import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditableTreeListComponent } from './editable-tree-list.component';
import { FormsModule } from '@angular/forms';
import { MenuModule } from '../../../navigation/menu/menu.module';
import { IconsModule } from '../../../icons/icons.module';
import { EventManagerPlugins } from '../../../services/utils/eventManager.plugins';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [EditableTreeListComponent],
  imports: [
    CommonModule,
    FormsModule,
    MenuModule,
    IconsModule,
    DragDropModule,
    TranslateModule,
  ],
  exports: [EditableTreeListComponent],
  providers: [EventManagerPlugins[0]],
})
export class EditableTreeListModule {}
