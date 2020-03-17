import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { escapeRegExp, has } from 'lodash';
import { PanelPositionService } from '../../popups/panel/panel-position-service/panel-position.service';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subscription, race } from 'rxjs';
import {
  CdkOverlayOrigin,
  Overlay,
  OverlayConfig,
  OverlayRef,
} from '@angular/cdk/overlay';
import { AutoCompleteOption } from './auto-complete.interface';
import { InputAutoCompleteOptions } from '../../form-elements/input/input.enum';
import { OverlayPositionClasses } from '../../types';
import { UtilsService } from '../../services/utils/utils.service';
import { ListPanelService } from '../../lists/list-panel.service';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { PanelDefaultPosVer } from '../../popups/panel/panel.enum';

@Component({
  selector: 'b-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss'],
})
export class AutoCompleteComponent implements OnChanges, OnDestroy {
  constructor(
    private cd: ChangeDetectorRef,
    private listPanelSrvc: ListPanelService,

    // Used by ListPanelService:
    private zone: NgZone,
    private DOM: DOMhelpers,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private panelPositionService: PanelPositionService,
    private utilsService: UtilsService
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

  @Output() searchChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() optionSelect: EventEmitter<AutoCompleteOption> = new EventEmitter<
    AutoCompleteOption
  >();

  searchValue = '';
  filteredOptions: AutoCompleteOption[];

  // Used by ListPanelService:
  private subscribtions: Subscription[] = [];
  public panelPosition = PanelDefaultPosVer.belowLeftRight;
  private panelClassList: string[] = ['b-auto-complete-panel'];
  public positionClassList: OverlayPositionClasses = {};
  private panelConfig: OverlayConfig;
  private overlayRef: OverlayRef;
  private templatePortal: TemplatePortal;
  public panelOpen = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (has(changes, 'options')) {
      this.options = changes.options.currentValue;
      this.filteredOptions = this.getFilteredOptions();
    }
  }

  onSearchChange(searchVal: string): void {
    this.searchValue = searchVal;
    if (this.searchValue.length > 0) {
      this.openPanel();
    } else {
      this.destroyPanel();
    }
    this.updateFilteredList();
    this.searchChange.emit(this.searchValue);
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

  onEscape(): void {
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
      this.listPanelSrvc.openPanel(this);
    }
  }

  private destroyPanel(skipEmit = false): void {
    this.listPanelSrvc.destroyPanel(this, skipEmit);
  }

  private getFilteredOptions(): AutoCompleteOption[] {
    const matcher = new RegExp(escapeRegExp(this.searchValue), 'i');

    return this.options.filter(
      option =>
        option.value.match(matcher) ||
        (option.subText && option.subText.match(matcher))
    );
  }
}
