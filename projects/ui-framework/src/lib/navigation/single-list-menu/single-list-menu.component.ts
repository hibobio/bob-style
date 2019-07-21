import {
  ChangeDetectorRef, Component, Input, NgZone, OnChanges, OnDestroy, SimpleChanges, ViewContainerRef,
} from '@angular/core';
import { BaseSelectPanelElement } from '../../form-elements/lists/select-panel-element.abstract';
import { Overlay } from '@angular/cdk/overlay';
import { PanelPositionService } from '../../popups/panel/panel-position-service/panel-position.service';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';
import { LIST_EL_HEIGHT } from '../../form-elements/lists/list.consts';
import { ListChange } from '../../form-elements/lists/list-change/list-change';
import { SelectGroupOption } from '../../form-elements/lists/list.interface';
import { SingleListMenuItem } from './single-list-menu.interface';
import { has } from 'lodash';

@Component({
  selector: 'b-single-list-menu',
  templateUrl: './single-list-menu.component.html',
  styleUrls: [
    './single-list-menu.component.scss',
    '../../form-elements/lists/single-select/single-select.component.scss',
  ],
})
export class SingleListMenuComponent extends BaseSelectPanelElement
  implements OnChanges, OnDestroy {

  @Input() chevronText: string;
  @Input() menu: SingleListMenuItem[];

  readonly listElHeight = LIST_EL_HEIGHT;
  singleSelectOptions: SelectGroupOption[];
  panelClassList: string[] = ['b-single-menu'];

  constructor(
    overlay: Overlay,
    viewContainerRef: ViewContainerRef,
    panelPositionService: PanelPositionService,
    DOM: DOMhelpers,
    zone: NgZone,
    cd: ChangeDetectorRef,
  ) {
    super(overlay, viewContainerRef, panelPositionService, DOM, zone, cd);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (has(changes, 'menu')) {
      this.menu = changes.menu.currentValue;
      this.singleSelectOptions = [
        {
          groupName: '',
          options: this.menu.map(menuItem => {
            return {
              value: menuItem.label,
              id: menuItem.key || menuItem.label,
              selected: false,
            };
          })
        },
      ];
    }
  }

  onSelect(listChange: ListChange): void {
    const selectedMenuOption = this.menu.find(menuItem => {
      const key = menuItem.key || menuItem.label;
      return key === listChange.getSelectedIds()[0];
    });
    selectedMenuOption.action(selectedMenuOption);
    this.destroyPanel();
  }

  ngOnDestroy(): void {
    this.destroyPanel();
  }
}
