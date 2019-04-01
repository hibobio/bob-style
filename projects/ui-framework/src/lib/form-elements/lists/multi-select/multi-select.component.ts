import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { chain, includes, map, assign } from 'lodash';
import { PanelPositionService } from '../../../overlay/panel/panel-position.service';
import { LIST_EL_HEIGHT } from '../list.consts';
import { ButtonSize, ButtonType } from '../../../buttons-indicators/buttons/buttons.enum';
import { BaseSelectPanelElement } from '../select-panel-element.abstract';
import { SelectGroupOption } from '../list.interface';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconColor, Icons, IconSize } from '../../../icons/icons.enum';
import { ListChange } from '../list-change/list-change';
import { ListChangeService } from '../list-change/list-change.service';
import { ListModelService } from '../list-service/list-model.service';

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
  ]
})
export class MultiSelectComponent extends BaseSelectPanelElement implements OnInit, OnChanges, OnDestroy {
  @ViewChild('triggerInput') triggerInput;

  @Input() options: SelectGroupOption[];
  @Input() showSingleGroupHeader = false;
  @Output() selectChange: EventEmitter<ListChange> = new EventEmitter<ListChange>();
  @Output() selectModified: EventEmitter<ListChange> = new EventEmitter<ListChange>();

  triggerValue: string;
  blockSelectClick: boolean;
  selectedValuesMap: (number | string)[];

  readonly listElHeight = LIST_EL_HEIGHT;
  readonly buttonSize = ButtonSize;
  readonly buttonType = ButtonType;
  readonly resetIcon: String = Icons.reset_x;
  readonly iconSize = IconSize;
  readonly iconColor = IconColor;

  private listChange: ListChange;

  constructor(
    overlay: Overlay,
    viewContainerRef: ViewContainerRef,
    panelPositionService: PanelPositionService,
    private listChangeService: ListChangeService,
    private listModelService: ListModelService,
  ) {
    super(overlay, viewContainerRef, panelPositionService);
  }

  ngOnInit(): void {
    this.selectedValuesMap = this.options
      ? this.getSelectedValuesMap(this.options)
      : [];
    this.setTriggerValue();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.options) {
      this.options = changes.options.currentValue;
      this.selectedValuesMap = this.getSelectedValuesMap(this.options);
      this.setTriggerValue();
    }
  }

  ngOnDestroy(): void {
    this.destroyPanel();
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
  }

  notifySelectionIds(): void {
    const listChange = this.listChange
      ? this.listChange
      : this.listChangeService.getListChange(this.options, this.selectedValuesMap);
    this.emitSelectChange(listChange);
    this.destroyPanel();
  }

  clearSelection(): void {
    this.selectedValuesMap = [];
    this.setTriggerValue();
    this.options = this.removeAllSelected(this.options);
    const listChange = this.listChangeService.getListChange(this.options, this.selectedValuesMap);
    this.emitSelectChange(listChange);
    setTimeout(() => {
      this.blockSelectClick = false;
      this.triggerInput.bInput.nativeElement.blur();
    });
  }

  private emitSelectChange(listChange: ListChange): void {
    this.options = listChange.getSelectGroupOptions();
    this.selectChange.emit(listChange);
    const selectedValue = listChange.getSelectedIds();
    this.propagateChange(selectedValue);
  }

  private emitSelectModified(listChange: ListChange): void {
    this.selectModified.emit(listChange);
  }

  private setTriggerValue(): void {
    this.triggerValue = this.getTriggerValue(this.selectedValuesMap);
    this.updateTriggerTooltip();
  }

  private getTriggerValue(selectedValuesMap: (string | number)[]): string {
    return chain(this.options)
      .flatMap('options')
      .filter((option) => includes(selectedValuesMap, option.id))
      .map('value')
      .join(', ')
      .value();
  }

  private getSelectedValuesMap(options: SelectGroupOption[]): (number | string)[] {
    return this.listModelService.getSelectedIdsMap(options);
  }

  private removeAllSelected(options: SelectGroupOption[]): SelectGroupOption[] {
    return map(options, g => {
      return assign({}, g, {
        options: map(g.options, o => {
          return assign({}, o, { selected: false });
        }),
      });
    });
  }
}
