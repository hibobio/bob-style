import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { InputObservable, InputSubject } from '../../services/utils/decorators';
import { itemID, SelectGroupOption, SelectOption } from '../../lists/list.interface';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { asArray, isNotEmptyArray, unsubscribeArray } from '../../services/utils/functional-utils';
import { map } from 'rxjs/operators';
import { ListChange } from '../../lists/list-change/list-change';
import { SingleListComponent } from '../single-list/single-list.component';

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

  protected readonly subs: Subscription[] = [];

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
        .subscribe(this.listValue$)
    );
  }

  ngOnDestroy(): void {
    unsubscribeArray(this.subs);

    [
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
}
