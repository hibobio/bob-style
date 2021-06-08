import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Icon } from '../../icons/icon.interface';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { EmptyStateConfig } from '../../indicators/empty-state/empty-state.interface';
import {
  itemID,
  SelectGroupOption,
  SelectOption,
} from '../../lists/list.interface';
import { TruncateTooltipType } from '../../popups/truncate-tooltip/truncate-tooltip.enum';
import { InputObservable, InputSubject } from '../../services/utils/decorators';
import {
  arrayRemoveItemMutate,
  asArray,
  getFuzzyMatcher,
  isEmptyArray,
  isEmptyString,
  isNotEmptyArray,
  isNotEmptyString,
  unsubscribeArray,
} from '../../services/utils/functional-utils';
import { DISPLAY_SEARCH_OPTION_NUM } from '../list.consts';
import { SingleListComponent } from '../single-list/single-list.component';

export interface ViewListItem {
  id: itemID;
  value: string;
  groupName: string;
}

@Component({
  selector: 'b-select-and-view',
  templateUrl: './select-and-view.component.html',
  styleUrls: ['./select-and-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectAndViewComponent implements OnInit, OnDestroy {
  constructor(
    private translateService: TranslateService,
    private cd: ChangeDetectorRef
  ) {}

  @InputObservable([])
  @Input('options')
  public inputOptions$: Observable<SelectGroupOption[]>;

  @InputSubject([])
  @Input('value')
  public listValue$: BehaviorSubject<itemID[]>;

  @Input() valueDefault: itemID[];

  @ViewChild(SingleListComponent, { static: true })
  listComponent: SingleListComponent;

  @Output() changed: EventEmitter<itemID[]> = new EventEmitter();

  public selectOptions$: BehaviorSubject<
    SelectGroupOption[]
  > = new BehaviorSubject(undefined);
  public viewList$: BehaviorSubject<ViewListItem[]> = new BehaviorSubject(
    undefined
  );
  public searchValue$: BehaviorSubject<string> = new BehaviorSubject('');

  private readonly subs: Subscription[] = [];
  readonly tooltipType = TruncateTooltipType.material;
  readonly viewItemIconConfig: Icon = {
    size: IconSize.small,
    color: IconColor.light,
    icon: Icons.drag_alt,
  };
  readonly removeViewItemIconConfig: Icon = {
    size: IconSize.small,
    color: IconColor.dark,
    icon: Icons.reset_x,
  };
  readonly emptyStateConfig: EmptyStateConfig = {
    icon: Icons.checkbox,
    text: this.translateService.instant(
      'bob-style.select-and-view.empty-list-text'
    ),
  };

  public shouldDisplaySearch = false;
  public shouldDisplayEmpty = false;

  public get value(): itemID[] {
    return this.listValue$.getValue();
  }
  public set value(value: itemID[]) {
    this.listValue$.next(value);
  }

  ngOnInit(): void {
    this.subs.push(
      combineLatest([this.inputOptions$, this.listValue$])
        .pipe(
          map(([options, value]) =>
            isNotEmptyArray(value)
              ? this.getOptionsWithoutSelected(options, value)
              : options
          )
        )
        .subscribe(this.selectOptions$),
      this.listComponent.selectChange
        .pipe(
          map((listChange) =>
            asArray(this.listValue$.getValue()).concat(
              listChange.selectedIDs || []
            )
          )
        )
        .subscribe(this.listValue$),
      combineLatest([this.inputOptions$, this.listValue$, this.searchValue$])
        .pipe(
          tap(([_, value, searchValue]) => {
            this.shouldDisplaySearch =
              isNotEmptyString(searchValue) ||
              value.length >= DISPLAY_SEARCH_OPTION_NUM;
            this.shouldDisplayEmpty =
              isEmptyString(searchValue) && isEmptyArray(value);
            this.cd.detectChanges();
          }),
          map(([options, value, searchValue]) =>
            isNotEmptyArray(value)
              ? this.getViewListData(options, value, searchValue)
              : []
          )
        )
        .subscribe(this.viewList$),
      this.listValue$.subscribe(this.changed)
    );
  }

  ngOnDestroy(): void {
    unsubscribeArray(this.subs);

    [this.viewList$, this.selectOptions$, this.changed].forEach((subj) =>
      subj.complete()
    );
  }

  private getOptionsWithoutSelected(
    options: SelectGroupOption[],
    value: itemID[]
  ): SelectGroupOption[] {
    return options
      .map((group) => ({
        ...group,
        options: group.options
          .filter((option: SelectOption) => !asArray(value).includes(option.id))
          .map((option: SelectOption) => ({ ...option, selected: false })),
      }))
      .filter((group) => group.options.length);
  }

  private getViewListData(
    options: SelectGroupOption[],
    value: itemID[],
    searchValue: string
  ): ViewListItem[] {
    const data = [];
    const matcher = getFuzzyMatcher(searchValue);

    options.forEach((group) =>
      group.options.forEach(
        (option) =>
          asArray(value).includes(option.id) &&
          (matcher.test(group.groupName) || matcher.test(option.value)) &&
          data.push({
            value: option.value,
            groupName: group.groupName,
            id: option.id,
          })
      )
    );

    return data.sort((a, b) => value.indexOf(a.id) - value.indexOf(b.id));
  }

  public removeItemFromList(itemId: itemID): void {
    this.listValue$.next(
      arrayRemoveItemMutate(this.listValue$.getValue()?.slice(), itemId)
    );
  }

  public searchChange(searchValue: string): void {
    this.searchValue$.next(searchValue.trim());
  }

  public resetValue(): void {
    this.listValue$.next(this.valueDefault);
  }
}
