import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  BehaviorSubject,
  combineLatest,
  merge,
  Observable,
  Subscription,
} from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  skip,
} from 'rxjs/operators';
import { FormElementSize } from '../../form-elements/form-elements.enum';
import { Icons } from '../../icons/icons.enum';
import { EmptyStateConfig } from '../../indicators/empty-state/empty-state.interface';
import { ListChange } from '../../lists/list-change/list-change';
import { ListChangeService } from '../../lists/list-change/list-change.service';
import { MULTI_LIST_LIST_ACTIONS_DEF } from '../../lists/list-footer/list-footer.const';
import { ListModelService } from '../../lists/list-service/list-model.service';
import { LIST_EL_HEIGHT } from '../../lists/list.consts';
import { SelectMode } from '../../lists/list.enum';
import {
  itemID,
  ListFooterActions,
  SelectGroupOption,
} from '../../lists/list.interface';
import { MultiListComponent } from '../../lists/multi-list/multi-list.component';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { InputObservable } from '../../services/utils/decorators';
import {
  asArray,
  isArray,
  isArrayOrNull,
  isNotEmptyArray,
  notFirstChanges,
  objectRemoveKey,
  simpleArraysEqual,
  simpleUID,
  unsubscribeArray,
} from '../../services/utils/functional-utils';
import { MultiListAndSomething } from './multi-list-and-something.interface';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class BaseMultiListAndSomethingElement<T = any>
  implements
    MultiListAndSomething<T>,
    OnChanges,
    OnInit,
    AfterViewInit,
    OnDestroy {
  constructor(
    public host: ElementRef,
    protected DOM: DOMhelpers,
    protected translate: TranslateService,
    protected listModelService: ListModelService,
    protected listChangeService: ListChangeService,
    protected zone: NgZone,
    protected cd: ChangeDetectorRef
  ) {
    this.listActions = { ...MULTI_LIST_LIST_ACTIONS_DEF };
    this.emptyState = {
      text: this.translate.instant('bob-style.table.empty-state-default'),
      icon: Icons.three_dots,
    };
  }

  @ViewChild(MultiListComponent, { static: true }) list: MultiListComponent;

  @HostBinding('attr.data-size') @Input() size = FormElementSize.regular;

  @Input() optionsDefault: SelectGroupOption[];
  @Input() mode: SelectMode = SelectMode.classic;
  @Input() listLabel: string;
  @Input() otherLabel: string;
  @Input() showSingleGroupHeader = false;
  @Input() startWithGroupsCollapsed = true;
  @Input() emptyState: EmptyStateConfig;
  @Input() listActions: ListFooterActions;

  @Input() min: number;
  @Input() max: number;

  @Input() maxHeight: number;
  public listMaxHeight: number;

  @Output() selectChange: EventEmitter<ListChange> = new EventEmitter<
    ListChange
  >();

  @Output() changed: EventEmitter<itemID[]> = new EventEmitter<itemID[]>();

  readonly listElHeight: number = LIST_EL_HEIGHT;
  readonly listID: string = simpleUID('mlas-');
  readonly otherID: string = simpleUID('mlas-');

  @InputObservable([])
  @Input('options')
  public inputOptions$: Observable<SelectGroupOption[]>;

  @InputObservable(null)
  @Input('value')
  public inputValue$: Observable<itemID[]>;

  public listOptions$: BehaviorSubject<
    SelectGroupOption[]
  > = new BehaviorSubject(undefined);

  public listValue$: BehaviorSubject<itemID[]> = new BehaviorSubject(null);

  public otherList$: BehaviorSubject<T[]> = new BehaviorSubject(undefined);

  // for compatibility
  public get options(): SelectGroupOption[] {
    return this.listOptions$.getValue();
  }
  public set options(options: SelectGroupOption[]) {
    this.listOptions$.next(options);
  }
  public get value(): itemID[] {
    return this.listValue$.getValue();
  }
  public set value(value: itemID[]) {
    this.listValue$.next(value);
  }

  protected subs: Subscription[] = [];

  ngOnInit(): void {
    //
    const validInputOptions$ = this.inputOptions$.pipe(
      filter((ops) => isNotEmptyArray(ops)),
      map((options: SelectGroupOption[]) =>
        options.filter((group) => group.options?.length)
      ),
      shareReplay(1)
    );

    const distinctValue$ = this.listValue$.pipe(
      filter((value) => isArrayOrNull(value)),
      distinctUntilChanged(simpleArraysEqual),
      shareReplay(1)
    );

    const latestOptionsAndValue$ = combineLatest([
      validInputOptions$,
      distinctValue$,
    ]).pipe(shareReplay(1));

    // update ListValue from inputs and Multi-List's List Changes
    this.subs.push(
      merge(
        this.inputValue$,

        validInputOptions$.pipe(
          filter(() => this.listValue$.getValue() === null),
          map((options) => this.listModelService.getSelectedIDs(options))
        ),

        this.list.selectChange.pipe(
          map((listChange) => {
            return listChange.selectedIDs;
          })
        )
      )
        .pipe(
          filter(
            (value) =>
              isArray(value) &&
              !simpleArraysEqual(value, this.listValue$.getValue())
          )
        )
        .subscribe(this.listValue$)
    );

    // combine Options+Value inputs to Multi-lists's options
    // this is supposed to happen once
    this.subs.push(
      validInputOptions$
        .pipe(
          map((options) => {
            const value = this.listValue$.getValue();
            return isArray(value)
              ? this.listChangeService.getCurrentSelectGroupOptions({
                  options,
                  selectedIDs: value,
                })
              : options;
          })
        )
        .subscribe(this.listOptions$)
    );

    // map main list Options+Value to other list
    this.subs.push(
      latestOptionsAndValue$
        .pipe(
          map(([options, value]) => {
            return this.optionsToOtherList(options, value);
          })
        )
        .subscribe(this.otherList$)
    );

    // emit list change
    this.subs.push(
      latestOptionsAndValue$
        .pipe(
          filter(([options, value]) => {
            return isArray(value) && this.selectChange.observers.length > 0;
          }),
          skip(1),
          map(([options, value]) => {
            return this.listChangeService.getListChange(options, value);
          })
        )
        .subscribe(this.selectChange)
    );

    // emit changed
    this.subs.push(
      distinctValue$
        .pipe(
          filter((value) => isArray(value)),
          skip(1)
        )
        .subscribe(this.changed)
    );
  }

  public abstract optionsToOtherList(
    options: SelectGroupOption[],
    value: itemID[]
  ): T[];

  public unselectOptions(unselectedID: any | any[]): void {
    const IDs: itemID[] = asArray(unselectedID);
    const newValue = this.listValue$
      .getValue()
      ?.filter((id) => !IDs.includes(id));

    this.listValue$.next(newValue);
  }

  ngOnDestroy(): void {
    unsubscribeArray(this.subs);

    [
      this.listValue$,
      this.listOptions$,
      this.otherList$,
      this.selectChange,
      this.changed,
    ].forEach((subj) => subj.complete());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (notFirstChanges(changes, ['maxHeight'], true)) {
      this.processMaxHeight();
    }
  }

  ngAfterViewInit() {
    if (this.maxHeight && !this.listMaxHeight) {
      this.zone.runOutsideAngular(() => {
        this.DOM.mutate(() => {
          this.processMaxHeight();
        });
      });
    }
  }

  protected processMaxHeight(
    maxHeight = this.maxHeight
  ): {
    listMaxHeight: number;
    maxHeightItems: number;
    maxHeight: number;
  } {
    const processed = this.list.processMaxHeight(maxHeight);

    Object.assign(this, objectRemoveKey(processed, 'maxHeightItems'));
    this.cd.detectChanges();

    this.DOM.setCssProps(this.host.nativeElement, {
      '--mlas-max-height': this.maxHeight + 'px',
    });

    return processed;
  }
}
