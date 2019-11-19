import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ContentChildren,
  QueryList,
  OnDestroy,
  SimpleChanges,
  OnChanges,
  AfterContentInit,
} from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { QuickFilterConfig } from '../quick-filter/quick-filter.interface';
import { Icons, IconSize, IconColor } from '../../icons/icons.enum';
import { BaseFormElement } from '../../form-elements/base-form-element';
import { TruncateTooltipType } from '../../popups/truncate-tooltip/truncate-tooltip.enum';
import { BaseButtonElement } from '../../buttons/button.abstract';
import { GenericObject } from '../../types';
import {
  applyChanges,
  notFirstChanges,
  onlyUpdatedProps,
  asArray,
  hasProp,
  cloneArray,
} from '../../services/utils/functional-utils';
import { simpleChange } from '../../services/utils/test-helpers';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { keyBy } from 'lodash';
import { ListChange } from '../../form-elements/lists/list-change/list-change';
import { IGNORE_EVENTS_DEF } from '../../form-elements/form-elements.const';

@Component({
  selector: 'b-quick-filter-layout',
  templateUrl: './quick-filter-layout.component.html',
  styleUrls: ['../quick-filter/quick-filter-bar.component.scss'],
  animations: [
    trigger('reset', [
      transition(':enter', [
        style({ transform: 'scale(0.4)' }),
        animate(
          '350ms cubic-bezier(0.3,1.55,0.85,1.45)',
          style({ transform: 'scale(1)' })
        ),
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)' }),
        animate(
          '350ms cubic-bezier(0.8,-0.9,0.95,0.4)',
          style({ transform: 'scale(0.4)' })
        ),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickFilterLayoutComponent
  implements OnChanges, OnInit, AfterContentInit, OnDestroy {
  constructor(private cd: ChangeDetectorRef) {}

  @ContentChildren(BaseFormElement) public formComponents: QueryList<
    BaseFormElement
  >;
  @ContentChildren(BaseButtonElement, { read: ElementRef })
  public actionButtons: QueryList<ElementRef>;

  @Input() quickFilters: QuickFilterConfig[];
  @Input() showResetFilter = false;

  @Output() filtersChange: EventEmitter<GenericObject> = new EventEmitter<
    GenericObject
  >();
  @Output() resetFilters: EventEmitter<void> = new EventEmitter<void>();

  public value: GenericObject = {};
  public hasPrefix = true;
  public hasSuffix = true;

  private formCompCount = 0;
  private actButtsCount = 0;
  private formCompEmittersMap: GenericObject = {};
  private emitDebouncer: Subject<GenericObject> = new Subject<GenericObject>();
  private subscribtions: Subscription[] = [];
  private hasChanges = false;

  readonly icons = Icons;
  readonly iconSize = IconSize;
  readonly iconColor = IconColor;

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(this, changes);

    if (notFirstChanges(changes, ['quickFilters'])) {
      const updatedCompProps = onlyUpdatedProps(
        keyBy(changes.quickFilters.previousValue, 'key'),
        keyBy(changes.quickFilters.currentValue, 'key')
      );

      this.assignFormCompAttrs(Object.values(
        updatedCompProps
      ) as QuickFilterConfig[]);

      this.initValue(Object.keys(updatedCompProps).map(key =>
        this.formComponents.toArray().find(comp => comp.id === key)
      ) as BaseFormElement[]);

      this.cd.detectChanges();
    }
  }

  ngOnInit() {
    this.subscribtions.push(
      this.emitDebouncer.pipe(debounceTime(300)).subscribe(value => {
        this.transmit(value);
      })
    );
  }

  ngAfterContentInit(): void {
    this.initFormElements();

    this.subscribtions.push(
      this.formComponents.changes.subscribe(() => {
        const currentIDs = this.formComponents.toArray().map(cmp => cmp.id);
        const prevIDs = Object.keys(this.formCompEmittersMap);
        let newIDs: string[];

        if (prevIDs.length > 0) {
          const deletedIDs = prevIDs.filter(id => !currentIDs.includes(id));
          newIDs = currentIDs.filter(id => !prevIDs.includes(id));

          deletedIDs.forEach(id => {
            delete this.formCompEmittersMap[id];
            delete this.value[id];
          });
        }

        // this.cd.detectChanges();

        if ((newIDs || currentIDs).length > 0) {
          this.initFormElements();
        }

        console.log('currentIDs: ' + currentIDs);
        console.log('prevIDs: ' + prevIDs);
        console.log('newIDs: ' + newIDs);
      })
    );

    this.initActionButtons();

    this.subscribtions.push(
      this.actionButtons.changes.subscribe(() => {
        if (this.actionButtons.length !== this.actButtsCount) {
          this.initActionButtons();
        }
      })
    );
  }

  private initFormElements(): void {
    this.formCompCount = this.formComponents.length;

    this.formComponents.toArray().forEach(formComp => {
      if (!Object.keys(this.formCompEmittersMap).includes(formComp.id)) {
        Object.assign(formComp, {
          panelClass: 'b-quick-filter-panel',
          tooltipType: TruncateTooltipType.material,
          doPropagate: false,
          wrapEvent: false,
          ignoreEvents: cloneArray(IGNORE_EVENTS_DEF),
        });

        this.subscribtions.push(
          this.getChangeEmitter(formComp as any).subscribe(
            (changeEvent: any) => {
              this.onFilterChange(formComp.id, changeEvent);
            }
          )
        );

        if (this.quickFilters) {
          this.assignFormCompAttrs(this.quickFilters, formComp);
        }

        this.initValue(formComp);
      }
    });

    this.cd.detectChanges();
  }

  private assignFormCompAttrs(
    quickFilters: QuickFilterConfig[] = this.quickFilters,
    formComp: BaseFormElement | BaseFormElement[] = null
  ): void {
    (formComp ? asArray(formComp) : this.formComponents.toArray()).forEach(
      cmp => {
        cmp.ngOnChanges(
          simpleChange(quickFilters.find(fltr => fltr.key === cmp.id))
        );
      }
    );
  }

  private initValue(
    formComp: BaseFormElement | BaseFormElement[] = null
  ): void {
    (formComp ? asArray(formComp) : this.formComponents.toArray()).forEach(
      (cmp: BaseFormElement) => {
        if (cmp !== undefined) {
          this.value[cmp.id] = this.formCompIsSelect(cmp)
            ? (this.value[cmp.id] = new ListChange(cmp['options'] || []))
            : cmp.value !== undefined
            ? cmp.value
            : cmp.baseValue;
        }
      }
    );
  }

  private initActionButtons(): void {
    this.actButtsCount = this.actionButtons.length;

    const buttons = this.actionButtons
      .toArray()
      .map((butt: ElementRef): HTMLElement => butt.nativeElement);

    this.hasPrefix = Boolean(
      buttons.find(butt =>
        Boolean(butt.getAttributeNames().includes('bar-prefix'))
      )
    );
    this.hasSuffix = Boolean(
      buttons.find(butt =>
        Boolean(butt.getAttributeNames().includes('bar-suffix'))
      )
    );

    this.cd.detectChanges();
  }

  onFilterChange(key: string, changeEvent: any): void {
    this.value[key] = changeEvent;
    this.hasChanges = true;
    this.emitDebouncer.next(this.value);
  }

  onReset(): void {
    if (this.resetFilters.observers.length > 0) {
      this.resetFilters.emit();
    } else if (this.quickFilters) {
      this.assignFormCompAttrs(
        this.quickFilters.map(fltr => ({
          ...fltr,
          value: hasProp(fltr, 'value') ? fltr.value : null,
        }))
      );
      this.initValue();
      this.emitDebouncer.next(this.value);
    }
  }

  ngOnDestroy(): void {
    this.emitDebouncer.complete();

    this.subscribtions.forEach(sub => {
      sub.unsubscribe();
      sub = null;
    });
    this.subscribtions = null;
  }

  private transmit(value: GenericObject): void {
    this.filtersChange.emit(value);
    console.log(value);
  }

  private formCompIsSelect(formComp: BaseFormElement): boolean {
    return /SelectComponent/i.test(formComp.constructor.name);
  }

  private findChangeEmitterKey(formComp: BaseFormElement): string {
    return (this.formCompEmittersMap[formComp.id] = formComp['selectChange']
      ? 'selectChange'
      : Object.keys(formComp).find(
          (key: string): boolean =>
            /change|inputEvents/i.test(key) && formComp[key].observers
        ));
  }

  private getChangeEmitter(formComp: BaseFormElement): EventEmitter<any> {
    return formComp[
      this.formCompEmittersMap[formComp.id] ||
        this.findChangeEmitterKey(formComp)
    ];
  }

  public showResetButt(): boolean {
    return (
      this.showResetFilter &&
      (!this.quickFilters || (this.quickFilters && this.hasChanges))
    );
  }
}
