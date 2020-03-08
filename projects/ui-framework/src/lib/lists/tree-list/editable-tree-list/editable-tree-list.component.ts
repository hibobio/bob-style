import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  ElementRef,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  applyChanges,
  hasChanges,
} from '../../../services/utils/functional-utils';
import {
  TreeListOption,
  TreeListKeyMap,
  TreeListItemMap,
  itemID,
  TreeListItem,
} from '../tree-list.interface';
import { BTL_KEYMAP_DEF } from '../tree-list.const';
import { TreeListModelService } from '../services/tree-list-model.service';

@Component({
  selector: 'b-editable-tree-list',
  templateUrl: './editable-tree-list.component.html',
  styleUrls: ['./editable-tree-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditableTreeListComponent implements OnChanges {
  constructor(private modelSrvc: TreeListModelService) {}

  @Input('list') set setList(list: TreeListOption[]) {}
  public list: TreeListOption[];
  @Input() keyMap: TreeListKeyMap = BTL_KEYMAP_DEF;

  @ViewChild('listElement', { static: true, read: ElementRef })
  protected listElement: ElementRef;

  public itemsMap: TreeListItemMap = new Map();
  public listViewModel: itemID[] = [];

  public $listViewModel: BehaviorSubject<itemID[]> = new BehaviorSubject<
    itemID[]
  >([]);

  public ngOnChanges(changes: SimpleChanges): void {
    applyChanges(
      this,
      changes,
      {
        keyMap: BTL_KEYMAP_DEF,
      },
      ['list'],
      false,
      {
        keyMap: { list: 'setList' },
      }
    );

    if (hasChanges(changes, ['keyMap'], true)) {
      this.keyMap = { ...BTL_KEYMAP_DEF, ...this.keyMap };
    }

    if (hasChanges(changes, ['list'], true)) {
      this.list = changes.list.currentValue || [];

      this.itemsMap.clear();
      this.modelSrvc.getListItemsMap(this.list, this.itemsMap, {
        keyMap: this.keyMap,
      });

      this.updateListViewModel();
    }
  }

  private updateListViewModel(): void {
    this.listViewModel = this.modelSrvc.getListViewModel(
      this.list,
      this.itemsMap,
      {
        keyMap: this.keyMap,
      }
    );

    this.$listViewModel.next(this.listViewModel);
  }

  private emitChange(): void {}

  public toggleItemCollapsed(item: TreeListItem, element: HTMLElement): void {}

  public onListClick(event: MouseEvent): void {}

  public onListKeyDown(event: KeyboardEvent) {}

  public trackBy(index: number, id: itemID): itemID {
    return id;
  }

  public dndShouldAnimateDrop() {
    return false;
  }

  public dndGetChildPayload(item: TreeListItem) {
    return (index: number) => item;
  }

  // Dev / Debug

  log(what = 'Data') {
    switch (what) {
      case 'Data':
        console.log('---------CMPNT---------\n', this);
        console.log('---------LIST---------\n', this.list);
        console.log('---------MAP---------\n', this.itemsMap);
        console.log('---------VIEWMODEL---------\n', this.listViewModel);
        break;

      case 'ViewContext':
        console.log(
          '------------------\n',
          'Items view context:\n',
          this.listViewModel.map(id => {
            const item = this.itemsMap.get(id);
            return {
              id: item.id,
              collapsed: item.collapsed,
              parentCount: item.parentCount,
              childrenCount: item.childrenCount,
              groupsCount: item.groupsCount,
              selectedCount: item.selectedCount,
              allOptionsHidden: item.allOptionsHidden,
              nextInViewIsGroup: item.nextInViewIsGroup,
            };
          })
        );
        break;
    }
  }
}
