import { Component, EventEmitter, forwardRef, Input, OnChanges, OnDestroy, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { chain, includes } from 'lodash';
import { PanelPositionService } from '../../../overlay/panel/panel-position.service';
import { LIST_EL_HEIGHT } from '../list.consts';
import { ButtonSize, ButtonType } from '../../../buttons-indicators/buttons';
import { BaseSelectPanelElement } from '../select-panel-element.abstract';
import { SelectGroupOption } from '../list.interface';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconColor, Icons, IconSize } from '../../../icons';

@Component({
  selector: 'b-multi-select',
  templateUrl: 'multi-select.component.html',
  styleUrls: ['multi-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true
    }
  ],
})

export class MultiSelectComponent extends BaseSelectPanelElement implements OnChanges, OnDestroy {

  @ViewChild('triggerInput') triggerInput;

  @Input() options: SelectGroupOption[];
  @Input() value: (string | number)[] = [];
  @Input() showSingleGroupHeader = false;
  @Output() selectChange: EventEmitter<(string | number)[]> = new EventEmitter<(string | number)[]>();

  triggerValue: string;
  blockSelectClick: boolean;

  readonly listElHeight = LIST_EL_HEIGHT;
  readonly buttonSize = ButtonSize;
  readonly buttonType = ButtonType;
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

  ngOnChanges(): void {
    this.value = this.value || [];
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

  clearSelection(): void {
    this.value = [];
    this.triggerValue = this.getTriggerValue(this.value);
    setTimeout(() => {
      this.blockSelectClick = false;
      this.triggerInput.bInput.nativeElement.blur();
    });
  }

  private getTriggerValue(value: (string | number)[]): string {
    this.updateTriggerTooltip();
    return chain(this.options)
      .flatMap('options')
      .filter(option => includes(value, option.id))
      .map('value')
      .join(', ')
      .value();
  }
}
