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
  AfterContentInit,
} from '@angular/core';
import { BasicListItem } from './basic-list.interface';
import { BasicListActionDirective } from './basic-list-action.directive';
import { IconColor } from '../../icons/icons.enum';
import {
  asArray,
  cloneDeepSimpleObject,
  isEmptyArray,
  isNotEmptyArray,
} from '../../services/utils/functional-utils';
import { BasicListType } from './basic-list.enum';

@Component({
  selector: 'b-basic-list',
  templateUrl: './basic-list.component.html',
  styleUrls: ['./basic-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicListComponent implements AfterContentInit {
  constructor(private zone: NgZone, private cd: ChangeDetectorRef) {}

  @ContentChild(BasicListActionDirective, { static: true })
  contentChild!: BasicListActionDirective;

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

    this.labelsCount = this.items[0].label.length;
    this.singleLabel = this.labelsCount === 1;
    this.isTable = this.labelsCount > 1;

    if (this.items.find((itm) => itm.label.length !== this.labelsCount)) {
      console.warn(
        'BasicListComponent: BasicListItems should have the same number of label texts.'
      );
      this.isTable = false;
    }

    if (this.initDone && this.titles && !this.tableCellCount) {
      this.ngAfterContentInit();
    }
  }

  @Input('titles') set setTitles(titles: string[]) {
    if (isNotEmptyArray(titles)) {
      this.titles = cloneDeepSimpleObject(titles);

      if (this.initDone && this.items && !this.tableCellCount) {
        this.ngAfterContentInit();
      }
    }
  }

  @Output() clicked: EventEmitter<BasicListItem> = new EventEmitter<
    BasicListItem
  >();

  public items: BasicListItem[];
  public titles: string[];
  public isTable = true;
  public singleLabel = false;

  readonly iconColor = IconColor;

  private labelsCount: number;
  private tableCellCount: number;
  private initDone = false;

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

  ngAfterContentInit(): void {
    this.initDone = true;

    if (!this.items || !this.titles) {
      return;
    }

    this.tableCellCount =
      this.labelsCount +
      +(this.items[0].icon ? 1 : 0) +
      (this.contentChild ? 1 : 0);

    if (this.titles.length !== this.tableCellCount) {
      this.titles = this.titles.filter(Boolean).slice(0, this.labelsCount);

      if (this.items[0].icon) {
        this.titles.unshift('');
      }
      if (this.contentChild) {
        this.titles.push('');
      }

      this.titles = this.titles.slice(0, this.tableCellCount);

      this.cd.detectChanges();
    }
  }

  public itemTrackBy(index: number, item: BasicListItem): string {
    return index + item.label[0];
  }

  public titleTrackBy(index: number, item: string): string {
    return index + item;
  }
}
