import { Component, EventEmitter, Input, OnInit, Output, ContentChild } from '@angular/core';
import { cloneDeep, isNull } from 'lodash';
import { Icons, IconSize } from '../../../icons/icons.enum';
import { ButtonSize, ButtonType } from '../../../buttons/buttons.enum';
import { ChainSelectDirective } from './chain-select.directive';
import { ChainSelectEvent } from './chain-select.interface';
import { ChainSelectEventEnum } from './chain-select.enum';

@Component({
  selector: 'b-chain-select',
  templateUrl: './chain-select.component.html',
  styleUrls: ['./chain-select.component.scss']
})
export class ChainSelectComponent implements OnInit {
  @Input() actionLabel: string;
  @Input() selectedItemList: any[];
  @Output() selectChange: EventEmitter<ChainSelectEvent> =
    new EventEmitter<ChainSelectEvent>();

  public chainLinkList: any[];

  readonly icons = Icons;
  readonly iconSize = IconSize;
  readonly buttonType = ButtonType;
  readonly buttonSize = ButtonSize;

  @ContentChild(ChainSelectDirective, { static: true }) contentChild !: ChainSelectDirective;

  ngOnInit() {
    if (this.selectedItemList && this.selectedItemList.length) {
      this.chainLinkList = cloneDeep(this.selectedItemList)
        .map(item => isNull(item) ? {} : item);
    } else {
      this.chainLinkList = [{}];
    }
  }

  public addChainLink() {
    this.chainLinkList.push({});
  }

  public removeChainLink(index: number) {
    this.chainLinkList.splice(index, 1);
    this.selectChange.emit({
      index,
      event: ChainSelectEventEnum.delete,
    });
  }

  public handleChange($event, index) {
    this.selectChange.emit({ index, event: $event });
  }
}
