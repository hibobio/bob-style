import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeListModelService } from '../services/tree-list-model.service';
import { EditableTreeListComponent } from './editable-tree-list.component';
import { FormsModule } from '@angular/forms';
import { MenuModule } from '../../../navigation/menu/menu.module';
import { IconsModule } from '../../../icons/icons.module';
import { TreeListControlsService } from '../services/tree-list-controls.service';
import { EventManagerPlugins } from '../../../services/utils/eventManager.plugins';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [EditableTreeListComponent],
  imports: [CommonModule, FormsModule, MenuModule, IconsModule, DragDropModule],
  exports: [EditableTreeListComponent],
  providers: [
    TreeListModelService,
    TreeListControlsService,
    EventManagerPlugins[0],
  ],
})
export class EditableTreeListModule {}
