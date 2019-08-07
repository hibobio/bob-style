import { Component, EventEmitter, Input, OnInit, Output, Type } from '@angular/core';
import { isEmpty, clone } from 'lodash';
import { ChainLink, SelectComponentConfig } from './chain-select.interface';
import { Icons, IconSize } from '../../../icons/icons.enum';
import { ButtonSize, ButtonType } from '../../../buttons-indicators/buttons/buttons.enum';
import { ListChange } from '../list-change/list-change';

@Component({
  selector: 'b-chain-select',
  templateUrl: './chain-select.component.html',
  styleUrls: ['./chain-select.component.scss']
})
export class ChainSelectComponent implements OnInit {
  @Input() actionLabel: string;
  @Input() selectComponent: Type<any>;
  @Input() selectComponentConfig: SelectComponentConfig;
  @Output() selectChange: EventEmitter<ListChange[]> =
    new EventEmitter<ListChange[]>();

  readonly icons = Icons;
  readonly iconSize = IconSize;
  readonly buttonType = ButtonType;
  readonly buttonSize = ButtonSize;
  public chainLinkList: ChainLink[];
  public state: ListChange[];

  constructor() {}

  ngOnInit() {
    if (isEmpty(this.selectComponentConfig.selectedIds) || !this.selectComponentConfig.selectedIdKey) {
      this.chainLinkList = [this.createEmptyChainLink(0)];
      this.state = [null];
    } else {
      this.chainLinkList = this.selectComponentConfig.selectedIds.map((optionId, index) => ({
        active: false,
        selectComponentConfig: {
          component: this.selectComponent,
          attributes: {
            [this.selectComponentConfig.selectedIdKey]: optionId,
          },
          handlers: {
            [this.selectComponentConfig.outputKey]: $event => this.handleChange($event, index)
          }
        }
      }));
      this.state = this.selectComponentConfig.selectedIds.map(() => null);
    }
  }

  public addChainLink() {
    this.chainLinkList.push(this.createEmptyChainLink(this.chainLinkList.length));
  }

  public removeChainLink(index: number) {
    this.chainLinkList.splice(index, 1);
    this.state.splice(index, 1);
    this.selectChange.emit(this.state);
  }

  public activateChainLink(event, index: number) {
    this.chainLinkList[index].active = true;
  }

  public deactivateChainLink(event, index: number) {
    this.chainLinkList[index].active = false;
  }

  private createEmptyChainLink(index: number): ChainLink {
    return {
      active: false,
      selectComponentConfig: {
        component: this.selectComponent,
        handlers: {
          [this.selectComponentConfig.outputKey]: $event => this.handleChange($event, index)
        }
      }
    };
  }

  private handleChange($event, index) {
    this.state.splice(index, 1, $event);
    this.selectChange.emit(this.state);
  }
}
