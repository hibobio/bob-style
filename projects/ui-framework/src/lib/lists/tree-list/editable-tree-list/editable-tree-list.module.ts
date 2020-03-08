import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeListModelService } from '../services/tree-list-model.service';
import { EditableTreeListComponent } from './editable-tree-list.component';
import { FormsModule } from '@angular/forms';
import { NgxSmoothDnDModule } from 'ngx-smooth-dnd';

@NgModule({
  declarations: [EditableTreeListComponent],
  imports: [CommonModule, FormsModule, NgxSmoothDnDModule],
  exports: [EditableTreeListComponent],
  providers: [TreeListModelService],
})
export class EditableTreeListModule {}
