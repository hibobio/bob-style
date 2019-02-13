import { Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { chain } from 'lodash';
import { PanelPositionService } from '../../../overlay/panel/panel-position.service';
import { LIST_EL_HEIGHT } from '../list.consts';
import { BaseSelectPanelElement } from '../select-panel-element.abstract';
import { SelectGroupOption } from '../list.interface';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconColor, Icons, IconSize } from '../../../icons';

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

  @ViewChild('triggerInput') triggerInput;

  @Input() options: SelectGroupOption[];
  @Input() value: string | number;
  @Input() showSingleGroupHeader = false;
  @Output() selectChange: EventEmitter<(string | number)> = new EventEmitter<(string | number)>();

  triggerValue: string;
  showTriggerTooltip: boolean;
  blockSelectClick: boolean;

  readonly listElHeight = LIST_EL_HEIGHT;
  readonly resetIcon: String = Icons.reset_x;
  readonly iconSize: String = IconSize.medium;
  readonly iconColor: String = IconColor.dark;

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

  clearSelection(): void {
    this.value = null;
    this.triggerValue = this.getTriggerValue(this.value);
    setTimeout(() => {
      this.blockSelectClick = false;
      this.triggerInput.bInput.nativeElement.blur();
    });
  }

  ngOnDestroy(): void {
    this.destroyPanel();
  }

  private getTriggerValue(value: string | number): string {
    this.updateTriggerTooltip();
    return chain(this.options)
      .flatMap('options')
      .filter(option => option.id === value)
      .first()
      .get('value', null)
      .value();
  }
}
