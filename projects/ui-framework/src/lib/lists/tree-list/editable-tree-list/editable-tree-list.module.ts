import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeListModelService } from '../services/tree-list-model.service';
import { EditableTreeListComponent } from './editable-tree-list.component';
import { FormsModule } from '@angular/forms';
import { MenuModule } from '../../../navigation/menu/menu.module';
import { IconsModule } from '../../../icons/icons.module';

@NgModule({
  declarations: [EditableTreeListComponent],
  imports: [CommonModule, FormsModule, MenuModule, IconsModule],
  exports: [EditableTreeListComponent],
  providers: [TreeListModelService],
})
export class EditableTreeListModule {}
