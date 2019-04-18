import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { chain, isNull, isUndefined } from 'lodash';
import { PanelPositionService } from '../../../overlay/panel/panel-position-service/panel-position.service';
import { LIST_EL_HEIGHT } from '../list.consts';
import { BaseSelectPanelElement } from '../select-panel-element.abstract';
import { SelectGroupOption } from '../list.interface';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconColor, Icons, IconSize } from '../../../icons/icons.enum';
import { ListChange } from '../list-change/list-change';
import { ListChangeService } from '../list-change/list-change.service';

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
  ]
})
export class SingleSelectComponent extends BaseSelectPanelElement implements OnChanges, OnDestroy {
  @ViewChild('triggerInput') triggerInput;

  @Input() options: SelectGroupOption[];
  @Input() showSingleGroupHeader = false;
  @Output() selectChange: EventEmitter<ListChange> = new EventEmitter<ListChange>();

  triggerValue: string;
  showTriggerTooltip: boolean;
  blockSelectClick: boolean;
  singleSelectOptions: SelectGroupOption[];
  selectedOptionId: number | string;

  readonly listElHeight = LIST_EL_HEIGHT;
  readonly resetIcon: String = Icons.reset_x;
  readonly iconSize = IconSize;
  readonly iconColor = IconColor;

  constructor(
    overlay: Overlay,
    viewContainerRef: ViewContainerRef,
    panelPositionService: PanelPositionService,
    private listChangeService: ListChangeService,
  ) {
    super(overlay, viewContainerRef, panelPositionService);
    this.value = null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.options) {
      this.singleSelectOptions = changes.options.currentValue;
      this.selectedOptionId = this.getSelectedOptionId(this.singleSelectOptions);
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
    const listChange = this.listChangeService.getListChange(this.singleSelectOptions, []);
    this.emitChange(listChange);
    setTimeout(() => {
      this.blockSelectClick = false;
      this.triggerInput.bInput.nativeElement.blur();
    });
  }

  ngOnDestroy(): void {
    this.destroyPanel();
  }

  private getTriggerValue(selectedOptionId: string | number): string {
    this.updateTriggerTooltip();
    return chain(this.singleSelectOptions)
      .flatMap('options')
      .filter((option) => option.id === selectedOptionId)
      .first()
      .get('value', null)
      .value();
  }

  private getSelectedOptionId(options: SelectGroupOption[]): (number | string) {
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
  }
}
