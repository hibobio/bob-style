import { has } from 'lodash';

import { CdkOverlayOrigin, OverlayRef } from '@angular/cdk/overlay';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { InputAutoCompleteOptions } from '../../form-elements/input/input.enum';
import {
  ListPanelService,
  OverlayEnabledComponent,
} from '../../lists/list-panel.service';
import { PanelDefaultPosVer } from '../../popups/panel/panel.enum';
import { Panel } from '../../popups/panel/panel.interface';
import { getFuzzyMatcher } from '../../services/utils/functional-utils';
import { OverlayPositionClasses } from '../../types';
import { AutoCompleteOption } from './auto-complete.interface';

@Component({
  selector: 'b-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss'],
})
export class AutoCompleteComponent
  implements OverlayEnabledComponent, OnInit, OnChanges, OnDestroy
{
  constructor(
    public viewContainerRef: ViewContainerRef,
    public cd: ChangeDetectorRef,
    private listPanelSrvc: ListPanelService
  ) {}

  @ViewChild(CdkOverlayOrigin, { static: true })
  overlayOrigin: CdkOverlayOrigin;
  @ViewChild('templateRef', { static: true }) templateRef: TemplateRef<any>;

  @Input() label: string;
  @Input() placeholder: string;
  @Input() hideLabelOnFocus = true;
  @Input() enableBrowserAutoComplete: InputAutoCompleteOptions =
    InputAutoCompleteOptions.off;
  @Input() options: AutoCompleteOption[];
  @Input() displayOptionsOnFocus = false;
  @Input() skipOptionsFiltering = false;
  @Input() hideIcon = false;

  @Output() searchChange: EventEmitter<string> = new EventEmitter();
  @Output()
  optionSelect: EventEmitter<AutoCompleteOption> = new EventEmitter();

  searchValue = '';
  filteredOptions: AutoCompleteOption[];

  public panel: Panel;
  public panelOpen = false;
  public panelPosition = PanelDefaultPosVer.belowLeftRight;
  public panelClassList: string[] = ['b-auto-complete-panel'];
  public positionClassList: OverlayPositionClasses = {};

  public get overlayRef(): OverlayRef {
    return this.panel?.overlayRef;
  }

  private getFilteredOptions: () => AutoCompleteOption[] = this.skipFiltering;
  private changeOptionsFlow: (changes: SimpleChanges) => void =
    this.changeOptions;

  ngOnInit(): void {
    this.getFilteredOptions = this.skipOptionsFiltering
      ? this.skipFiltering
      : this.filterOptions;
    this.changeOptionsFlow = this.skipOptionsFiltering
      ? this.changeOptionsAndOpenPanel
      : this.changeOptions;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (has(changes, 'options')) {
      this.changeOptionsFlow(changes);
    }
  }

  private changeOptions(changes: SimpleChanges) {
    this.options = changes.options.currentValue;
    this.filteredOptions = this.getFilteredOptions();
  }

  private changeOptionsAndOpenPanel(changes: SimpleChanges) {
    this.changeOptions(changes);
    this.openPanel();
  }

  onSearchChange(searchVal: string): void {
    this.searchValue = searchVal;
    if (this.searchValue.length > 0) {
      this.openPanel();
    } else {
      this.destroyPanel();
    }
    this.updateFilteredList();
    this.searchChange.emit(this.searchValue.trim());
  }

  onSearchFocus(): void {
    if (this.displayOptionsOnFocus) {
      this.openPanel();
      this.updateFilteredList();
    }
  }

  onOptionSelect(option: AutoCompleteOption): void {
    this.searchValue = option.value;
    this.optionSelect.emit(option);
    this.destroyPanel();
  }

  ngOnDestroy(): void {
    this.destroyPanel(true);
  }

  private updateFilteredList(): void {
    this.filteredOptions = this.getFilteredOptions();
    if (this.filteredOptions.length === 0) {
      this.destroyPanel();
    }
  }

  private openPanel(): void {
    if (this.options.length > 0) {
      this.panel = this.listPanelSrvc.openPanel({ self: this });
    }
  }

  private destroyPanel(skipEmit = false): void {
    this.panel = this.listPanelSrvc.destroyPanel({ self: this, skipEmit });
  }

  private filterOptions(): AutoCompleteOption[] {
    const matcher = getFuzzyMatcher(this.searchValue);

    return this.options.filter((option) => {
      return matcher.test(option.value) || matcher.test(option.subText);
    });
  }

  private skipFiltering(): AutoCompleteOption[] {
    return this.options;
  }
}
