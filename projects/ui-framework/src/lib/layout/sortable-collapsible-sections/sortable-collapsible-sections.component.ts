import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';
import { CollapsibleContentDirective } from './collapsible-content.directive';
import { SortableCollapsibleDropped, SortableCollapsibleSection } from './sortable-collapsible-sections.interface';
import { CollapsibleHeaderDirective } from './collapsible-header.directive';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CollapsibleSectionComponent } from '../collapsible-section/collapsible-section.component';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'b-sortable-collapsible-sections',
  templateUrl: './sortable-collapsible-sections.component.html',
  styleUrls: ['./sortable-collapsible-sections.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortableCollapsibleSectionsComponent implements OnChanges {

  @ContentChild(CollapsibleHeaderDirective, { static: true }) collapsibleHeader !: CollapsibleHeaderDirective;
  @ContentChild(CollapsibleContentDirective, { static: true }) collapsibleContent !: CollapsibleContentDirective;

  @ViewChildren(CollapsibleSectionComponent, { read: CollapsibleSectionComponent })
  private collapsibleSections: QueryList<CollapsibleSectionComponent>;

  @Input() sections: SortableCollapsibleSection[];

  @Output() dragStart: EventEmitter<number> = new EventEmitter<number>();
  @Output() dragEnd: EventEmitter<number> = new EventEmitter<number>();
  @Output() dropped: EventEmitter<SortableCollapsibleDropped> = new EventEmitter<SortableCollapsibleDropped>();
  @Output() openedFirst: EventEmitter<number> = new EventEmitter<number>();
  @Output() opened: EventEmitter<number> = new EventEmitter<number>();
  @Output() closed: EventEmitter<number> = new EventEmitter<number>();

  UISections: SortableCollapsibleSection[];
  dragging: boolean;
  draggedSection: SortableCollapsibleSection;
  contentLoadedMap: Map<number | string, boolean> = new Map();

  constructor(
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.sections && changes.sections.currentValue) {
      this.UISections = cloneDeep(this.sections);
      this.UISections.forEach(section => {
        if (section.expanded) {
          this.contentLoadedMap.set(section.id, true);
        }
      });
      this.cdr.detectChanges();
    }
  }

  onDrop(cdkDragDrop: CdkDragDrop<any>) {
    const { previousIndex, currentIndex } = cdkDragDrop;
    if (previousIndex !== currentIndex) {
      moveItemInArray(this.UISections, previousIndex, currentIndex);
    }
    this.dropped.emit({
      currentIndex,
      previousIndex,
      sections: this.UISections
    });
  }

  trackId(section: SortableCollapsibleSection): string | number {
    return section.id;
  }

  onDragHandlerMouseDown() {
    this.dragging = true;
    setTimeout(() => {
      this.collapsibleSections
        .toArray()
        .forEach(collapsibleSectionComponent => collapsibleSectionComponent.togglePanel(false));
      this.cdr.detectChanges();
    });
  }

  onClosed(index: number): void {
    if (!this.dragging) {
      this.closed.emit(index);
    }
  }

  onOpenedFirst(section: SortableCollapsibleSection) {
    this.contentLoadedMap.set(section.id, true);
  }
}
