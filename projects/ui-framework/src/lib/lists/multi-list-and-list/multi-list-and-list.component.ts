import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  itemID,
  SelectGroupOption,
  SelectOption,
} from '../../lists/list.interface';
import { isArray } from '../../services/utils/functional-utils';
import { TranslateService } from '@ngx-translate/core';
import { BasicListType } from '../../lists/basic-list/basic-list.enum';
import { ButtonType } from '../../buttons/buttons.enum';
import { BasicListComponent } from '../../lists/basic-list/basic-list.component';
import { BaseMultiListAndSomethingElement } from '../multi-list-and-chips/multi-list-and-something.abstract';
import { ListModelService } from '../list-service/list-model.service';
import { ListChangeService } from '../list-change/list-change.service';
import { MultiListAndSomething } from '../multi-list-and-chips/multi-list-and-something.interface';
import { ListRow, ListViewConfig } from './multi-list-and-list.interface';
import { MenuItem } from '../../navigation/menu/menu.interface';

@Component({
  selector: 'b-multi-list-and-list',
  templateUrl: './multi-list-and-list.component.html',
  styleUrls: [
    '../multi-list-and-chips/multi-list-and-something.scss',
    './multi-list-and-list.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiListAndListComponent
  extends BaseMultiListAndSomethingElement<ListRow>
  implements MultiListAndSomething<ListRow> {
  constructor(
    public host: ElementRef,
    protected translate: TranslateService,
    protected listModelService: ListModelService,
    protected listChangeService: ListChangeService,
    private cd: ChangeDetectorRef
  ) {
    super(translate, listModelService, listChangeService);
  }

  @ViewChild(BasicListComponent, { static: true })
  basicList: BasicListComponent;

  @Input('selectedLabel') otherLabel: string;

  // for compatibility
  public get selectedLabel(): string {
    return this.otherLabel;
  }
  public set selectedLabel(label: string) {
    this.otherLabel = label;
  }

  @Input() public listViewConfig: ListViewConfig;

  @Output() menuAction: EventEmitter<{
    action: string;
    item: itemID;
  }> = new EventEmitter<{
    action: string;
    item: itemID;
  }>();

  readonly buttonType: ButtonType = ButtonType.tertiary;
  readonly type: BasicListType = BasicListType.primary;

  public optionsToOtherList(
    options: SelectGroupOption[],
    value: itemID[]
  ): ListRow[] {
    const listItems: ListRow[] = [];

    const isSelected = (option: SelectOption) =>
      isArray(value) ? value.includes(option.id) : option.selected;

    options.forEach((optionGroup) =>
      optionGroup.options.forEach((op) => {
        if (isSelected(op)) {
          listItems.push({
            id: op.id,
            label: [
              `<strong>${optionGroup.groupName}</strong> - ${op.value}`,
              ...(op.subValue ? [op.subValue] : []),
            ],
            icon: this.listViewConfig?.rowStartIcon,
            actionIcon: this.listViewConfig?.rowAction?.icon,
            disabled: op.disabled,
            menu: this.listViewConfig?.rowAction?.menu,
          });
        }
      })
    );

    return listItems;
  }

  public unselectOptions(listRow: ListRow) {
    super.unselectOptions(listRow.id);
  }

  public emitMenuAction(menuItem: MenuItem, listRow: ListRow) {
    this.menuAction.emit({
      action: menuItem.label,
      item: listRow.id,
    });
  }
}
