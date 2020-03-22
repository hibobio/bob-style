import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeListModelService } from '../services/tree-list-model.service';
import { EditableTreeListComponent } from './editable-tree-list.component';
import { FormsModule } from '@angular/forms';
import { MenuModule } from '../../../navigation/menu/menu.module';
import { IconsModule } from '../../../icons/icons.module';
import { TreeListControlsService } from '../services/tree-list-controls.service';
import { TreeListViewService } from '../services/tree-list-view.service';
import { EventManagerPlugins } from '../../../services/utils/eventManager.plugins';

@NgModule({
  declarations: [EditableTreeListComponent],
  imports: [CommonModule, FormsModule, MenuModule, IconsModule],
  exports: [EditableTreeListComponent],
  providers: [
    TreeListModelService,
    TreeListViewService,
    TreeListControlsService,
    EventManagerPlugins[0],
  ],
})
export class EditableTreeListModule {}
