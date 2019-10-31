import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewContainerRef,
  ViewChild,
  NgZone,
  ChangeDetectorRef
} from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { assign, chain, includes, map } from 'lodash';
import { PanelPositionService } from '../../../popups/panel/panel-position-service/panel-position.service';
import { LIST_EL_HEIGHT } from '../list.consts';
import { BaseSelectPanelElement } from '../select-panel-element.abstract';
import { SelectGroupOption } from '../list.interface';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ListChange } from '../list-change/list-change';
import { ListChangeService } from '../list-change/list-change.service';
import { ListModelService } from '../list-service/list-model.service';
import { ListFooterActions } from '../list.interface';
import { TruncateTooltipComponent } from '../../../popups/truncate-tooltip/truncate-tooltip.component';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import { UtilsService } from '../../../services/utils/utils.service';
import {
  BELOW_START,
  ABOVE_START
} from '../../../popups/panel/panel-position-service/panel-position.const';

@Component({
  selector: 'b-multi-select',
  templateUrl: 'multi-select.component.html',
  styleUrls: [
    '../../input/input.component.scss',
    '../single-select/single-select.component.scss',
    'multi-select.component.scss'
  ],
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
  ]
})
export class MultiSelectComponent extends BaseSelectPanelElement
  implements OnInit, OnChanges {
  @ViewChild('triggerInput', { static: true })
  truncate: TruncateTooltipComponent;

  @Input() showSingleGroupHeader = false;

  @Output() selectModified: EventEmitter<ListChange> = new EventEmitter<
    ListChange
  >();
  @Output() selectCancelled: EventEmitter<ListChange> = new EventEmitter<
    ListChange
  >();

  triggerValue: string;
  selectedValuesMap: (number | string)[];

  readonly listActions: ListFooterActions = {
    clear: true,
    apply: true,
    cancel: true
  };
  readonly listElHeight = LIST_EL_HEIGHT;

  private listChange: ListChange;

  constructor(
    overlay: Overlay,
    viewContainerRef: ViewContainerRef,
    panelPositionService: PanelPositionService,
    utilsService: UtilsService,
    DOM: DOMhelpers,
    zone: NgZone,
    cd: ChangeDetectorRef,
    private listChangeService: ListChangeService,
    private listModelService: ListModelService
  ) {
    super(
      overlay,
      viewContainerRef,
      panelPositionService,
      utilsService,
      DOM,
      zone,
      cd
    );
    this.panelPosition = [BELOW_START, ABOVE_START];
  }

  ngOnInit(): void {
    this.selectedValuesMap = this.options
      ? this.getSelectedValuesMap(this.options)
      : [];
    this.setTriggerValue();
  }

  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);

    if (changes.options) {
      this.options = changes.options.currentValue;
      this.selectedValuesMap = this.getSelectedValuesMap(this.options);
      this.setTriggerValue();
    }
  }

  onSelect(listChange: ListChange): void {
    this.selectedValuesMap = listChange.getSelectedIds();
    this.setTriggerValue();
    this.listChange = listChange;
    this.emitSelectModified(listChange);
  }

  cancelSelection(): void {
    this.onCancel();
  }

  onCancel(): void {
    this.selectedValuesMap = this.getSelectedValuesMap(this.options);
    this.setTriggerValue();
    this.destroyPanel();
    this.selectCancelled.emit(this.getListChange());
  }

  onApply(): void {
    this.emitSelectChange(this.getListChange());
    this.destroyPanel();
  }

  private setTriggerValue(): void {
    this.triggerValue = this.getTriggerValue(this.selectedValuesMap);
  }

  private getTriggerValue(selectedValuesMap: (string | number)[]): string {
    return chain(this.options)
      .flatMap('options')
      .filter(option => includes(selectedValuesMap, option.id))
      .map('value')
      .join(', ')
      .value();
  }

  private getSelectedValuesMap(
    options: SelectGroupOption[]
  ): (number | string)[] {
    return this.listModelService.getSelectedIdsMap(options);
  }

  private removeAllSelected(options: SelectGroupOption[]): SelectGroupOption[] {
    return map(options, g => {
      return assign({}, g, {
        options: map(g.options, o => {
          return assign({}, o, { selected: false });
        })
      });
    });
  }

  private getListChange(): ListChange {
    return this.listChangeService.getListChange(
      this.options,
      this.selectedValuesMap
    );
  }

  private emitSelectChange(listChange: ListChange): void {
    this.options = listChange.getSelectGroupOptions();
    this.selectChange.emit(listChange);
    const selectedValue = listChange.getSelectedIds();
    this.propagateChange(selectedValue);
    this.onTouched();
  }

  private emitSelectModified(listChange: ListChange): void {
    this.selectModified.emit(listChange);
  }
}
