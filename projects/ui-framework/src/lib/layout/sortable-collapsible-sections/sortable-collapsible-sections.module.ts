import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortableCollapsibleSectionsComponent } from './sortable-collapsible-sections.component';
import { CollapsibleHeaderDirective } from './collapsible-header.directive';
import { CollapsibleContentDirective } from './collapsible-content.directive';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CollapsibleSectionModule } from '../collapsible-section/collapsible-section.module';

@NgModule({
  declarations: [
    SortableCollapsibleSectionsComponent,
    CollapsibleContentDirective,
    CollapsibleHeaderDirective,
  ],
  imports: [CommonModule, CollapsibleSectionModule, DragDropModule],
  exports: [
    SortableCollapsibleSectionsComponent,
    CollapsibleContentDirective,
    CollapsibleHeaderDirective,
  ],
  providers: [],
})
export class SortableCollapsibleSectionsModule {}
