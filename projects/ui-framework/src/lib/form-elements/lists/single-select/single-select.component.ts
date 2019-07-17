import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewContainerRef,
  NgZone,
  ChangeDetectorRef
} from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { chain, isNull, isUndefined } from 'lodash';
import { PanelPositionService } from '../../../popups/panel/panel-position-service/panel-position.service';
import { LIST_EL_HEIGHT } from '../list.consts';
import { BaseSelectPanelElement } from '../select-panel-element.abstract';
import { SelectGroupOption } from '../list.interface';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ListChange } from '../list-change/list-change';
import { ListChangeService } from '../list-change/list-change.service';
import { ListFooterActions } from '../list.interface';
import { DOMhelpers } from '../../../services/utils/dom-helpers.service';

@Component({
  selector: 'b-single-select',
  templateUrl: 'single-select.component.html',
  styleUrls: [
    '../../input/input.component.scss',
    'single-select.component.scss'
  ],
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
  ]
})
export class SingleSelectComponent extends BaseSelectPanelElement
  implements OnChanges, OnDestroy {
  @Input() options: SelectGroupOption[];
  @Input() showSingleGroupHeader = false;
  @Output() selectChange: EventEmitter<ListChange> = new EventEmitter<
    ListChange
  >();

  triggerValue: string;
  showTriggerTooltip: boolean;
  singleSelectOptions: SelectGroupOption[];
  selectedOptionId: number | string;

  readonly listElHeight = LIST_EL_HEIGHT;
  readonly listActions: ListFooterActions = {
    clear: true
  };

  constructor(
    overlay: Overlay,
    viewContainerRef: ViewContainerRef,
    panelPositionService: PanelPositionService,
    DOM: DOMhelpers,
    zone: NgZone,
    cd: ChangeDetectorRef,
    private listChangeService: ListChangeService
  ) {
    super(overlay, viewContainerRef, panelPositionService, DOM, zone, cd);
    this.value = null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.options) {
      this.singleSelectOptions = changes.options.currentValue;
      this.selectedOptionId = this.getSelectedOptionId(
        this.singleSelectOptions
      );
    }
    this.triggerValue = isNull(this.selectedOptionId)
      ? null
      : this.getTriggerValue(this.selectedOptionId);
  }

  onSelect(listChange: ListChange) {
    this.selectedOptionId = listChange.getSelectedIds()[0];
    this.triggerValue = this.getTriggerValue(this.selectedOptionId);
    this.emitChange(listChange);
    this.destroyPanel();
  }

  clearSelection(): void {
    this.selectedOptionId = null;
    this.triggerValue = this.getTriggerValue(this.selectedOptionId);
    const listChange = this.listChangeService.getListChange(
      this.singleSelectOptions,
      []
    );
    this.emitChange(listChange);
    this.destroyPanel();
  }

  ngOnDestroy(): void {
    this.destroyPanel();
  }

  private getTriggerValue(selectedOptionId: string | number): string {
    return chain(this.singleSelectOptions)
      .flatMap('options')
      .filter(option => option.id === selectedOptionId)
      .first()
      .get('value', null)
      .value();
  }

  private getSelectedOptionId(options: SelectGroupOption[]): number | string {
    return chain(options)
      .flatMap('options')
      .filter(o => o.selected)
      .flatMap('id')
      .first()
      .value();
  }

  private emitChange(listChange: ListChange): void {
    this.singleSelectOptions = listChange.getSelectGroupOptions();
    this.selectChange.emit(listChange);
    const selectedValue = listChange.getSelectedIds()[0];

    this.propagateChange(isUndefined(selectedValue) ? null : selectedValue);
    this.onTouched();
  }
}
