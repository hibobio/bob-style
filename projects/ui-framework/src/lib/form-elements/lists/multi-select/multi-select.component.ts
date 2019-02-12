import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewContainerRef } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { chain, includes } from 'lodash';
import { PanelPositionService } from '../../../overlay/panel/panel-position.service';
import { LIST_EL_HEIGHT } from '../list.consts';
import { ButtonSize, ButtonType } from '../../../buttons-indicators/buttons';
import { BaseSelectPanelElement } from '../select-panel-element.abstract';
import { SelectGroupOption } from '../list.interface';

@Component({
  selector: 'b-multi-select',
  templateUrl: 'multi-select.component.html',
  styleUrls: ['multi-select.component.scss'],
})

export class MultiSelectComponent extends BaseSelectPanelElement implements OnInit, OnDestroy {

  @Input() options: SelectGroupOption[];
  @Input() value: (string | number)[] = [];
  @Output() selectChange: EventEmitter<(string | number)[]> = new EventEmitter<(string | number)[]>();

  triggerValue: string;
  readonly buttonSize = ButtonSize;
  readonly buttonType = ButtonType;
  readonly listElHeight = LIST_EL_HEIGHT;

  constructor(
    overlay: Overlay,
    viewContainerRef: ViewContainerRef,
    panelPositionService: PanelPositionService,
  ) {
    super(overlay, viewContainerRef, panelPositionService);
  }

  ngOnInit(): void {
    this.triggerValue = this.getTriggerValue(this.value);
  }

  ngOnDestroy(): void {
    this.destroyPanel();
  }

  onSelect(value): void {
    this.value = value;
    this.triggerValue = this.getTriggerValue(this.value);
  }

  cancelSelection(): void {
    this.destroyPanel();
  }

  notifySelectionIds(): void {
    this.selectChange.emit(this.value);
    this.propagateChange(this.value);
  }

  private getTriggerValue(value: (string | number)[]): string {
    return chain(this.options)
      .flatMap('options')
      .filter(option => includes(value, option.id))
      .map('value')
      .join(', ')
      .value();
  }
}
