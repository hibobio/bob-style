import { Component, EventEmitter, Input, OnInit, Output, Type } from '@angular/core';
import { isEmpty, clone } from 'lodash';
import { ChainLink } from './chain-select.interface';
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
  @Input() selectedIdKey?: string;
  @Input() outputKey: string;
  @Input() selectedIds?: (string | number)[] = [];
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
    if (isEmpty(this.selectedIds) || !this.selectedIdKey) {
      this.chainLinkList = [this.createEmptyChainLink(0)];
      this.state = [new ListChange([])];
    } else {
      this.chainLinkList = this.selectedIds.map((optionId, index) => ({
        active: false,
        selectComponentConfig: {
          component: this.selectComponent,
          attributes: {
            [this.selectedIdKey]: optionId,
          },
          handlers: {
            [this.outputKey]: $event => this.handleChange($event, index)
          }
        }
      }));
      this.state = this.selectedIds.map((optionId) => new ListChange([{
        groupName: '',
        options: [{
          id: optionId,
          value: '',
          selected: true,
        }],
      }]));
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
          [this.outputKey]: $event => this.handleChange($event, index)
        }
      }
    };
  }

  private handleChange($event, index) {
    this.state.splice(index, 1, $event);
    this.selectChange.emit(this.state);
  }
}
