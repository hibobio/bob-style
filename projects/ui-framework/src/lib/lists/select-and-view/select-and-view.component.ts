import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { InputObservable } from '../../services/utils/decorators';
import { itemID, SelectGroupOption, SelectOption } from '../../lists/list.interface';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { asArray, isArray, unsubscribeArray } from '../../services/utils/functional-utils';
import { map } from 'rxjs/operators';
import { chain } from 'lodash';
import { ListChange } from '../../lists/list-change/list-change';

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

  @InputObservable(null)
  @Input('value')
  public inputValue$: Observable<itemID[]>;

  public selectOptions$: BehaviorSubject<SelectGroupOption[]> = new BehaviorSubject(undefined);
  public listValue$: BehaviorSubject<itemID[]> = new BehaviorSubject(null);

  protected readonly subs: Subscription[] = [];

  ngOnInit(): void {

    this.subs.push(this.inputValue$.subscribe(this.listValue$));

    this.subs.push(
      combineLatest([
        this.inputOptions$,
        this.listValue$,
      ])
        .pipe(
          map(([options, value]) => isArray(value)
            ? this.getOptionsWithoutSelected(options, value)
            : options),
        )
        .subscribe(this.selectOptions$)
    );
  }

  ngOnDestroy(): void {
    unsubscribeArray(this.subs);

    [
      this.selectOptions$,
    ].forEach((subj) => subj.complete());
  }

  private getOptionsWithoutSelected(options: SelectGroupOption[], value: itemID[]): SelectGroupOption[] {
    return chain(options)
      .map(group => ({
        ...group,
        options: group.options
          .filter((option: SelectOption) => !asArray(value).includes(option.id))
          .map((option: SelectOption) => ({ ...option, selected: false })),
      }))
      .filter(group => group.options.length)
      .value();
  }

  public onSelectChange(listChange: ListChange): void {
    const selected = listChange.getSelectedIds();
    const currentValue = this.listValue$.getValue();

    this.listValue$.next(currentValue.concat(selected));
  }
}
