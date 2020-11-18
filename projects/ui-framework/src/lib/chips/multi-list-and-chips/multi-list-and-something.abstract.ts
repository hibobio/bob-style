import {
  EventEmitter,
  Injectable,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  BehaviorSubject,
  combineLatest,
  merge,
  Observable,
  of,
  Subscription,
} from 'rxjs';
import { distinctUntilChanged, filter, map, skip } from 'rxjs/operators';
import { Icons } from '../../icons/icons.enum';
import { EmptyStateConfig } from '../../indicators/empty-state/empty-state.interface';
import { ListChange } from '../../lists/list-change/list-change';
import { ListChangeService } from '../../lists/list-change/list-change.service';
import { MULTI_LIST_LIST_ACTIONS_DEF } from '../../lists/list-footer/list-footer.const';
import { ListModelService } from '../../lists/list-service/list-model.service';
import { LIST_EL_HEIGHT } from '../../lists/list.consts';
import { SelectMode } from '../../lists/list.enum';
import {
  ListFooterActions,
  SelectGroupOption,
} from '../../lists/list.interface';
import { MultiListComponent } from '../../lists/multi-list/multi-list.component';
import { InputObservable } from '../../services/utils/decorators';
import {
  asArray,
  isArray,
  isArrayOrNull,
  isNotEmptyArray,
  simpleArraysEqual,
  simpleUID,
  unsubscribeArray,
} from '../../services/utils/functional-utils';
import { MultiListAndSomething } from './multi-list-and-something.interface';

@Injectable()
export abstract class BaseMultiListAndSomethingElement<T = any>
  implements MultiListAndSomething<T>, OnInit, OnDestroy {
  constructor(
    protected translate: TranslateService,
    protected listModelService: ListModelService,
    protected listChangeService: ListChangeService
  ) {
    this.listActions = { ...MULTI_LIST_LIST_ACTIONS_DEF };
    this.emptyState = {
      text: this.translate.instant('bob-style.table.empty-state-default'),
      icon: Icons.three_dots,
    };
  }

  @ViewChild(MultiListComponent, { static: true }) list: MultiListComponent;

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

  @Output() selectChange: EventEmitter<ListChange> = new EventEmitter<
    ListChange
  >();

  @Output() changed: EventEmitter<(string | number)[]> = new EventEmitter<
    (string | number)[]
  >();

  readonly listElHeight: number = LIST_EL_HEIGHT;
  readonly listID: string = simpleUID('mlas-');
  readonly otherID: string = simpleUID('mlas-');

  @InputObservable([])
  @Input('options')
  public inputOptions$: Observable<SelectGroupOption[]>;

  @InputObservable(null)
  @Input('value')
  public inputValue$: Observable<(string | number)[]>;

  public listOptions$: BehaviorSubject<
    SelectGroupOption[]
  > = new BehaviorSubject(undefined);

  public listValue$: BehaviorSubject<(string | number)[]> = new BehaviorSubject(
    null
  );

  public otherList$: BehaviorSubject<T[]> = new BehaviorSubject(undefined);

  protected subs: Subscription[] = [];

  ngOnInit(): void {
    //
    const validInputOptions$: Observable<
      SelectGroupOption[]
    > = this.inputOptions$.pipe(
      filter(isNotEmptyArray),
      map((options: SelectGroupOption[]) =>
        options.filter((group) => group.options?.length)
      )
    );

    const distinctValue$: Observable<
      (string | number)[]
    > = this.listValue$.pipe(
      filter(isArrayOrNull),
      distinctUntilChanged(simpleArraysEqual)
    );

    const latestOptionsAndValue$ = combineLatest([
      validInputOptions$,
      distinctValue$,
    ]);

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
    // (it does not have separate value input);
    // this is supposed to happen once
    this.subs.push(
      validInputOptions$
        .pipe(
          map((options) => {
            const value = this.listValue$.getValue();
            return isArray(value)
              ? this.listChangeService.getCurrentSelectGroupOptions(
                  options,
                  value
                )
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
      distinctValue$.pipe(filter(isArray), skip(1)).subscribe(this.changed)
    );
  }

  public optionsToOtherList(
    options: SelectGroupOption[],
    value: (string | number)[]
  ): T[] {
    return [];
  }

  public unselectOptions(unselectedID: any | any[]): void {
    const IDs: (string | number)[] = asArray(unselectedID);
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
}
