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
} from '@angular/core';
import { escapeRegExp, invoke, has } from 'lodash';
import { PanelPositionService } from '../../popups/panel/panel-position-service/panel-position.service';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subscription } from 'rxjs';
import {
  CdkOverlayOrigin,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef,
} from '@angular/cdk/overlay';
import { AutoCompleteOption } from './auto-complete.interface';
import { InputAutoCompleteOptions } from '../../form-elements/input/input.enum';
import { OverlayPositionClasses } from '../../types';
import { UtilsService } from '../../services/utils/utils.service';
import { outsideZone } from '../../services/utils/rxjs.operators';
import { throttleTime, map, pairwise, take, filter } from 'rxjs/operators';
import { ScrollEvent } from '../../services/utils/utils.interface';

@Component({
  selector: 'b-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss'],
})
export class AutoCompleteComponent implements OnChanges, OnDestroy {
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

  positionClassList: OverlayPositionClasses = {};
  searchValue = '';
  panelOpen = false;

  filteredOptions: AutoCompleteOption[];

  private panelConfig: OverlayConfig;
  private overlayRef: OverlayRef;
  private templatePortal: TemplatePortal;

  private subscribtions: Subscription[] = [];

  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private panelPositionService: PanelPositionService,
    private utilsService: UtilsService,
    private zone: NgZone
  ) {}

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
    this.destroyPanel();
  }

  private updateFilteredList(): void {
    this.filteredOptions = this.getFilteredOptions();
    if (this.filteredOptions.length === 0) {
      this.destroyPanel();
    }
  }

  private openPanel(): void {
    if (!this.panelOpen && this.options.length > 0) {
      this.panelOpen = true;
      this.panelConfig = this.getConfig();
      this.overlayRef = this.overlay.create(this.panelConfig);
      this.templatePortal = new TemplatePortal(
        this.templateRef,
        this.viewContainerRef
      );
      this.overlayRef.attach(this.templatePortal);

      this.overlayRef.updatePosition();
      this.overlayRef.updateSize({
        width: this.overlayOrigin.elementRef.nativeElement.offsetWidth,
      });

      this.subscribtions.push(
        this.overlayRef.backdropClick().subscribe(() => {
          this.destroyPanel();
        })
      );

      this.subscribtions.push(
        this.utilsService
          .getScrollEvent()
          .pipe(
            outsideZone(this.zone),
            throttleTime(500, undefined, {
              leading: true,
              trailing: true,
            }),
            map((e: ScrollEvent) => e.scrollY),
            pairwise(),
            filter(
              (scrollArr: number[]) =>
                Math.abs(scrollArr[0] - scrollArr.slice(-1)[0]) > 200
            ),
            take(1)
          )
          .subscribe(() => {
            this.destroyPanel();
          })
      );
    }
  }

  private destroyPanel(): void {
    if (this.panelOpen) {
      this.panelOpen = false;
      invoke(this.overlayRef, 'dispose');
      this.panelConfig = {};
      this.templatePortal = null;

      this.subscribtions.forEach(sub => {
        sub.unsubscribe();
        sub = null;
      });
      this.subscribtions = [];
    }
  }

  private getConfig(): OverlayConfig {
    const positionStrategy = this.panelPositionService.getCenterPanelPositionStrategy(
      this.overlayOrigin
    );
    this.subscribeToPositions(
      positionStrategy as FlexibleConnectedPositionStrategy
    );
    return {
      disposeOnNavigation: true,
      hasBackdrop: true,
      backdropClass: 'b-select-backdrop',
      panelClass: ['b-auto-complete-panel'],
      positionStrategy,
      scrollStrategy: this.panelPositionService.getScrollStrategy(),
    };
  }

  private subscribeToPositions(
    positionStrategy: FlexibleConnectedPositionStrategy
  ): void {
    this.subscribtions.push(
      positionStrategy.positionChanges.subscribe(change => {
        this.positionClassList = this.panelPositionService.getPositionClassList(
          change
        ) as OverlayPositionClasses;
      })
    );
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
