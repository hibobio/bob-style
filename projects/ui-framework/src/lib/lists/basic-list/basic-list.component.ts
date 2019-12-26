import { Component, ContentChild, Input, HostBinding } from '@angular/core';
import { BasicListItem } from './basic-list.interface';
import { BasicListActionDirective } from './basic-list-action.directive';
import { IconColor } from '../../icons/icons.enum';
import { asArray, isEmptyArray } from '../../services/utils/functional-utils';
import { BasicListType } from './basic-list.enum';

@Component({
  selector: 'b-basic-list',
  templateUrl: './basic-list.component.html',
  styleUrls: ['./basic-list.component.scss'],
})
export class BasicListComponent {
  @ContentChild(BasicListActionDirective, { static: true })
  contentChild!: BasicListActionDirective;

  readonly iconColor = IconColor;
  readonly asArray = asArray;

  public items: BasicListItem[];
  public isTable = true;
  public singleLabel = false;

  @HostBinding('attr.data-type') @Input() public type: BasicListType =
    BasicListType.primary;

  @Input() public showActionOnHover = false;

  @Input('items') set setItems(items: BasicListItem[]) {
    this.items = items || [];

    if (isEmptyArray(this.items)) {
      return;
    }

    this.isTable = true;
    const expectedLabelsCount = asArray(this.items[0].label).length;
    this.singleLabel = expectedLabelsCount === 1;

    if (
      this.items.find(itm => asArray(itm.label).length !== expectedLabelsCount)
    ) {
      console.warn(
        'BasicListComponent: BasicListItems should have the same number of label texts.'
      );
      this.isTable = false;
    }
  }
}
