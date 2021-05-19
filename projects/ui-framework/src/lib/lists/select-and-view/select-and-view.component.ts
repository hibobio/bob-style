import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { InputObservable, InputSubject } from '../../services/utils/decorators';
import { itemID, SelectGroupOption, SelectOption } from '../../lists/list.interface';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import {
  arrayRemoveItemMutate,
  asArray,
  isNotEmptyArray,
  unsubscribeArray
} from '../../services/utils/functional-utils';
import { map } from 'rxjs/operators';
import { SingleListComponent } from '../single-list/single-list.component';
import { Icon } from '../../icons/icon.interface';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';

export interface ViewListItem {
  id: itemID;
  value: string;
  groupName: string
}

@Component({
  selector: 'b-select-and-view',
  templateUrl: './select-and-view.component.html',
  styleUrls: ['./select-and-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectAndViewComponent implements OnInit, OnDestroy {

  @InputObservable([])
  @Input('options')
  public inputOptions$: Observable<SelectGroupOption[]>;

  @InputSubject([])
  @Input('value')
  public listValue$: BehaviorSubject<itemID[]>;

  @ViewChild(SingleListComponent, {static: true}) listComponent: SingleListComponent;

  public selectOptions$: BehaviorSubject<SelectGroupOption[]> = new BehaviorSubject(undefined);
  public viewList$: BehaviorSubject<ViewListItem[]> = new BehaviorSubject(undefined);

  protected readonly subs: Subscription[] = [];
  protected readonly viewItemIconConfig: Icon = {
    size: IconSize.small,
    color: IconColor.light,
    icon: Icons.drag_alt,
  };
  protected readonly removeViewItemIconConfig: Icon = {
    size: IconSize.small,
    color: IconColor.dark,
    icon: Icons.reset_x,
  };

  ngOnInit(): void {
    this.subs.push(
      combineLatest([
        this.inputOptions$,
        this.listValue$,
      ])
        .pipe(
          map(([options, value]) => isNotEmptyArray(value)
            ? this.getOptionsWithoutSelected(options, value)
            : options),
        )
        .subscribe(this.selectOptions$),
      this.listComponent.selectChange
        .pipe(
          map((listChange) =>  asArray(this.listValue$.getValue())
            .concat(listChange.selectedIDs || []))
        )
        .subscribe(this.listValue$),
      combineLatest([
        this.inputOptions$,
        this.listValue$,
      ])
        .pipe(
          map(([options, value]) => isNotEmptyArray(value)
            ? this.getViewListData(options, value)
            : []
          ),
        )
        .subscribe(this.viewList$)
    );
  }

  ngOnDestroy(): void {
    unsubscribeArray(this.subs);

    [
      this.viewList$,
      this.selectOptions$,
    ].forEach((subj) => subj.complete());
  }

  private getOptionsWithoutSelected(options: SelectGroupOption[], value: itemID[]): SelectGroupOption[] {
    return options
      .map(group => ({
        ...group,
        options: group.options
          .filter((option: SelectOption) => !asArray(value).includes(option.id))
          .map((option: SelectOption) => ({ ...option, selected: false })),
      }))
      .filter(group => group.options.length);
  }

  private getViewListData(options: SelectGroupOption[], value: itemID[]): ViewListItem[] {
    const data = [];

    options.forEach(group =>
      group.options.forEach(option =>
        asArray(value).includes(option.id)
        && data.push({ value: option.value, groupName: group.groupName, id: option.id })));

    return data.sort((a, b) => value.indexOf(a.id) < value.indexOf(b.id) ? -1 : 1);
  }

  public removeItemFromList(itemId: itemID): void {
    this.listValue$.next(
      arrayRemoveItemMutate(this.listValue$.getValue()?.slice(), itemId)
    );
  }
}
