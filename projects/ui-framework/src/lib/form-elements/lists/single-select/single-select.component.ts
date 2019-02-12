import { Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, ViewContainerRef } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { chain } from 'lodash';
import { PanelPositionService } from '../../../overlay/panel/panel-position.service';
import { LIST_EL_HEIGHT } from '../list.consts';
import { BaseSelectPanelElement } from '../select-panel-element.abstract';
import { SelectGroupOption } from '../list.interface';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'b-single-select',
  templateUrl: 'single-select.component.html',
  styleUrls: ['single-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SingleSelectComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SingleSelectComponent),
      multi: true
    }
  ],
})

export class SingleSelectComponent extends BaseSelectPanelElement implements OnInit, OnDestroy {

  @Input() options: SelectGroupOption[];
  @Input() value: string | number;
  @Input() showSingleGroupHeader = false;
  @Output() selectChange: EventEmitter<(string | number)> = new EventEmitter<(string | number)>();

  triggerValue: string;
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

  onSelect(optionId: (string | number)) {
    this.value = optionId;
    this.triggerValue = this.getTriggerValue(this.value);
    this.selectChange.emit(this.value);
    this.propagateChange(this.value);
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
