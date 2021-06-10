import { cloneDeep } from 'lodash';

import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import { ButtonSize, ButtonType } from '../../buttons/buttons.enum';
import { Icons, IconSize } from '../../icons/icons.enum';
import {
  applyChanges,
  asArray,
  getEmptyOfSameType,
  objectStringID,
} from '../../services/utils/functional-utils';
import { ChainSelectDirective } from './chain-select.directive';
import { ChainSelectEventEnum } from './chain-select.enum';
import { ChainSelectEvent } from './chain-select.interface';

@Component({
  selector: 'b-chain-select',
  templateUrl: './chain-select.component.html',
  styleUrls: ['./chain-select.component.scss'],
})
export class ChainSelectComponent implements OnChanges, OnInit {
  @ContentChild(ChainSelectDirective, { static: true })
  contentChild!: ChainSelectDirective;

  @Input() actionLabel: string;
  @Input() selectedItemList: any[];
  @Input() staticMode = false;

  @Output() selectChange: EventEmitter<ChainSelectEvent> = new EventEmitter();

  public chainLinkList: any[];

  readonly icons = Icons;
  readonly iconSize = IconSize;
  readonly buttonType = ButtonType;
  readonly buttonSize = ButtonSize;

  private emptyItem: any = null;

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(this, changes);

    if (changes.selectedItemList) {
      this.emptyItem =
        getEmptyOfSameType(
          asArray(this.selectedItemList || this.chainLinkList).filter(
            Boolean
          )[0]
        ) || null;

      this.chainLinkList = cloneDeep(this.selectedItemList || []);

      if (!this.chainLinkList.length) {
        this.addChainLink();
      }
    }
  }

  ngOnInit(): void {
    if (!this.chainLinkList) {
      this.chainLinkList = [];
      this.addChainLink();
    }
  }

  public addChainLink() {
    this.chainLinkList.push(getEmptyOfSameType(this.emptyItem));
  }

  public removeChainLink(index: number) {
    this.chainLinkList.splice(index, 1);
    this.selectChange.emit({
      index,
      event: ChainSelectEventEnum.delete,
    });
  }

  public handleChange(event: ChainSelectEvent, index: number): void {
    this.selectChange.emit({ index, event });
  }

  public trackBy(index: number, item: any): string {
    return item
      ? item.id ||
          item.value ||
          objectStringID(item, {
            key: index + '',
            limit: 1000,
            primitives: true,
          })
      : index;
  }
}
