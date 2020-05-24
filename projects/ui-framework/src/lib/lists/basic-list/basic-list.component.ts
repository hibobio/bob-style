import {
  Component,
  ContentChild,
  Input,
  HostBinding,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  NgZone,
  ChangeDetectionStrategy,
} from '@angular/core';
import { BasicListItem } from './basic-list.interface';
import { BasicListActionDirective } from './basic-list-action.directive';
import { IconColor } from '../../icons/icons.enum';
import { asArray, isEmptyArray } from '../../services/utils/functional-utils';
import { BasicListType } from './basic-list.enum';

@Component({
  selector: 'b-basic-list',
  templateUrl: './basic-list.component.html',
  styleUrls: ['./basic-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicListComponent {
  constructor(private zone: NgZone, private cd: ChangeDetectorRef) {}

  @ContentChild(BasicListActionDirective, { static: true })
  contentChild!: BasicListActionDirective;

  readonly iconColor = IconColor;

  public items: BasicListItem[];
  public isTable = true;
  public singleLabel = false;

  @HostBinding('attr.data-type') @Input() public type: BasicListType =
    BasicListType.primary;

  @Input() public showActionOnHover = false;

  @Input('items') set setItems(items: BasicListItem[]) {
    this.items = (items || []).map((item) => ({
      ...item,
      label: asArray(item.label),
    }));

    if (isEmptyArray(this.items)) {
      return;
    }

    const expectedLabelsCount = this.items[0].label.length;
    this.singleLabel = expectedLabelsCount === 1;
    this.isTable = expectedLabelsCount > 1;

    if (this.items.find((itm) => itm.label.length !== expectedLabelsCount)) {
      console.warn(
        'BasicListComponent: BasicListItems should have the same number of label texts.'
      );
      this.isTable = false;
    }

    this.cd.detectChanges();
  }

  @Output() clicked: EventEmitter<BasicListItem> = new EventEmitter<
    BasicListItem
  >();

  public onItemClick(item: BasicListItem, $event: MouseEvent): void {
    const target = $event.target as HTMLElement;
    if (
      this.clicked.observers &&
      target &&
      target.nodeName.toUpperCase() !== 'BUTTON'
    ) {
      this.zone.run(() => {
        this.clicked.emit(item);
      });
    }
  }

  public itemTrackBy(index: number, item: BasicListItem): string {
    return index + item.label[0];
  }
}
