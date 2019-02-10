import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewContainerRef } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { chain } from 'lodash';
import { PanelPositionService } from '../../../overlay/panel/panel-position.service';
import { SelectGroupOption } from '../../select';
import { LIST_EL_HEIGHT } from '../list.consts';
import { BaseSelectPanelElement } from '../select-panel-element.abstract';

@Component({
  selector: 'b-single-select',
  templateUrl: 'single-select.component.html',
  styleUrls: ['single-select.component.scss'],
})

export class SingleSelectComponent extends BaseSelectPanelElement implements OnInit, OnDestroy {

  @Input() options: SelectGroupOption[];
  @Input() value: string | number;
  @Output() selectChange: EventEmitter<any> = new EventEmitter<any>();

  triggerValue: any;
  readonly listElHeight = LIST_EL_HEIGHT;

  constructor(
    overlay: Overlay,
    viewContainerRef: ViewContainerRef,
    panelPositionService: PanelPositionService,
  ) {
    super(overlay, viewContainerRef, panelPositionService);
  }

  ngOnInit(): void {
    this.triggerValue = this.value ? this.getTriggerValue(this.value) : null;
  }

  onSelect(optionId) {
    this.value = optionId;
    this.triggerValue = this.getTriggerValue(this.value);
    this.selectChange.emit(this.value);
    this.destroyPanel();
  }

  ngOnDestroy(): void {
    this.destroyPanel();
  }

  private getTriggerValue(value: string | number): string {
    return chain(this.options)
      .flatMap('options')
      .filter(option => option.id === value)
      .first()
      .get('value', null)
      .value();
  }
}
