import {
  NgModule,
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonsModule } from '../../../../ui-framework/src/lib/buttons/buttons.module';
import { cloneDeep } from 'lodash';

import { FormsModule } from '@angular/forms';
import { QuickFilterConfig } from '../../../../ui-framework/src/lib/search/quick-filter/quick-filter.interface';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
// tslint:disable-next-line: max-line-length
import { QuickFilterLayoutModule } from '../../../../ui-framework/src/lib/search/quick-filter-layout/quick-filter-layout.module';
import { InputModule } from '../../../../ui-framework/src/lib/form-elements/input/input.module';
// tslint:disable-next-line: max-line-length
import { MultiSelectModule } from '../../../../ui-framework/src/lib/lists/multi-select/multi-select.module';
// tslint:disable-next-line: max-line-length
import { SingleSelectModule } from '../../../../ui-framework/src/lib/lists/single-select/single-select.module';
import { SocialModule } from '../../../../ui-framework/src/lib/form-elements/social/social.module';
// tslint:disable-next-line: max-line-length
import { DateRangePickerModule } from '../../../../ui-framework/src/lib/form-elements/date-picker/date-range-picker/date-range-picker.module';
import { TimePickerModule } from '../../../../ui-framework/src/lib/form-elements/timepicker/timepicker.module';
// tslint:disable-next-line: max-line-length
import { SplitInputSingleSelectModule } from '../../../../ui-framework/src/lib/form-elements/split-input-single-select/split-input-single-select.module';
import {
  mockText,
  mockISOdate,
  mockTime,
} from '../../../../ui-framework/src/lib/mock.const';
// tslint:disable-next-line: max-line-length
import { optionsMock as SSoptionsMock } from '../../../../ui-framework/src/lib/lists/single-list/single-list.mock';
// tslint:disable-next-line: max-line-length
import { optionsMock as MSoptionsMock } from '../../../../ui-framework/src/lib/lists/multi-list/multi-list.mock';
import { Social } from '../../../../ui-framework/src/lib/form-elements/social/social.enum';
import {
  randomNumber,
  randomFromArray,
} from '../../../../ui-framework/src/lib/services/utils/functional-utils';
import { QuickFilterLayoutComponent } from '../../../../ui-framework/src/lib/search/quick-filter-layout/quick-filter-layout.component';
import { DatepickerType } from '../../../../ui-framework/src/lib/form-elements/date-picker/datepicker.enum';
import { InputTypes } from '../../../../ui-framework/src/lib/form-elements/input/input.enum';
import { LinkColor } from '../../../../ui-framework/src/lib/indicators/link/link.enum';

const deselectOptions = (options) =>
  options.map((g) => ({
    ...g,
    options: g.options.map((o) => ({ ...o, selected: false })),
  }));

const selectRandom = (options) =>
  options.map((g) => ({
    ...g,
    options: g.options.map((o) => ({ ...o, selected: randomNumber() > 80 })),
  }));

const selectOneRandom = (options) => {
  const newOptions = deselectOptions(options);
  newOptions[randomNumber(0, newOptions.length - 1)].options[
    randomNumber(0, 3)
  ].selected = true;
  return newOptions;
};

const QFconfig = [
  {
    key: 'input',
    value: mockText(2),
    label: 'Input label',
    hintMessage: 'Input hint',
  },
  {
    key: 'singleSelect',
    label: 'SingleSelect label',
    hintMessage: 'SingleSelect hint',
    options: cloneDeep(SSoptionsMock),
  },
  {
    key: 'multiSelect',
    label: 'MultiSelect label',
    hintMessage: 'MultiSelect hint',
    options: cloneDeep(MSoptionsMock),
  },
  {
    key: 'social',
    type: randomFromArray(Object.values(Social)),
    label: 'Social label',
    hintMessage: 'Social hint',
    value: 'https://www.facebook.com/' + mockText(1),
  },
  {
    key: 'dateRange',
    type: 'date',
    label: 'DateRange label',
    hintMessage: 'DateRange hint',
    value: { from: mockISOdate(), to: mockISOdate() },
  },
  {
    key: 'timePicker',
    label: 'TimePicker label',
    hintMessage: 'TimePicker hint',
    value: '4:20',
  },
  {
    key: 'splitInpSel',
    label: 'SplitInpSel label',
    hintMessage: 'SplitInpSel hint',
    selectOptions: [
      {
        groupName: 'splitInpSel',
        options: [
          { value: 'sis-option-1', id: 'sis-option-1-id' },
          { value: 'sis-option-2', id: 'sis-option-2-id' },
          { value: 'sis-option-3', id: 'sis-option-3-id' },
        ],
      },
    ],
  },
];

QFconfig[1].options = selectOneRandom(SSoptionsMock);

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'filter-bar-test',
  template: `
    <div style="padding: 100px 50px">
      <b-quick-filter-layout
        *ngIf="qflShown"
        #qfl
        [quickFilters]="quickFilters"
        [showResetFilter]="show.ResetFilter"
        (filtersChange)="onFiltersChange($event)"
      >
        <b-text-button
          class="actButt"
          bar-prefix
          *ngIf="show.LeftButt"
          text="Left"
          [color]="linkColor.primary"
        >
        </b-text-button>

        <b-text-button
          class="actButt"
          bar-suffix
          *ngIf="show.RightButt"
          text="Right"
          [color]="linkColor.primary"
        >
        </b-text-button>

        <b-input *ngIf="show.Input" [id]="'input'" class="formComp"></b-input>

        <b-single-select
          *ngIf="show.SingleSelect"
          [id]="'singleSelect'"
          class="formComp"
        ></b-single-select>

        <b-multi-select
          *ngIf="show.MultiSelect"
          [id]="'multiSelect'"
          class="formComp"
        >
        </b-multi-select>

        <b-social
          *ngIf="show.Social"
          [id]="'social'"
          class="formComp"
        ></b-social>

        <b-timepicker
          *ngIf="show.TimePicker"
          [id]="'timePicker'"
          class="formComp"
        ></b-timepicker>

        <b-date-range-picker
          *ngIf="show.DateRange"
          [id]="'dateRange'"
          class="formComp"
        >
        </b-date-range-picker>

        <b-split-input-single-select
          *ngIf="show.SplitInpSel"
          [id]="'splitInpSel'"
          class="formComp"
        >
        </b-split-input-single-select>
      </b-quick-filter-layout>

      <div style="margin-top:50px; display: flex; flex-wrap: wrap">
        <label
          ><input
            [(ngModel)]="show.ResetFilter"
            type="checkbox"
          />showResetFilter</label
        >

        <label
          ><input
            [(ngModel)]="show.LeftButt"
            type="checkbox"
          />showLeftButt</label
        >

        <label
          ><input
            [(ngModel)]="show.RightButt"
            type="checkbox"
          />showRightButt</label
        >
      </div>
      <div style="margin-top:15px; display: flex; flex-wrap: wrap">
        <label
          ><input [(ngModel)]="show.Input" type="checkbox" />showInput</label
        >

        <label
          ><input
            [(ngModel)]="show.TimePicker"
            type="checkbox"
          />showTimePicker</label
        >

        <label
          ><input [(ngModel)]="show.Social" type="checkbox" />showSocial</label
        >

        <label
          ><input
            [(ngModel)]="show.SingleSelect"
            type="checkbox"
          />showSingleSelect</label
        >

        <label
          ><input
            [(ngModel)]="show.MultiSelect"
            type="checkbox"
          />showMultiSelect</label
        >

        <label
          ><input
            [(ngModel)]="show.DateRange"
            type="checkbox"
          />showDateRange</label
        >

        <label
          ><input
            [(ngModel)]="show.SplitInpSel"
            type="checkbox"
          />showSplitInpSel</label
        >
      </div>
      <button style="margin: 20px auto;" type="button" (click)="changeProps()">
        Change props
      </button>
      <button style="margin: 20px auto;" type="button" (click)="changeShow()">
        Show / hide
      </button>
      <button
        style="margin: 20px auto;"
        type="button"
        (click)="changeShowAll()"
      >
        Show / hide all
      </button>
      <label><input [(ngModel)]="qflShown" type="checkbox" />show comp</label>
      <label
        ><input [(ngModel)]="enblInterval" type="checkbox" />enable
        interval</label
      >
    </div>
  `,
  styles: [
    'label, span {display:block; margin: 3px 7px;}',
    '[type="checkbox"] {margin-right: 15px;}',
  ],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterBarTestComponent implements OnInit {
  constructor(private cd: ChangeDetectorRef) {}

  @ViewChild('qfl') private qfl: QuickFilterLayoutComponent;

  public quickFilters: QuickFilterConfig[] = QFconfig;

  public qflShown = true;
  public allShown = true;
  public enblInterval = false;

  readonly linkColor = LinkColor;

  public show = {
    ResetFilter: false,
    LeftButt: false,
    RightButt: false,
    Input: true,
    TimePicker: true,
    Social: true,
    SingleSelect: false,
    MultiSelect: false,
    DateRange: false,
    SplitInpSel: false,
  };

  public onFiltersChange($event) {
    console.log($event);
  }

  changeProps() {
    this.quickFilters = this.quickFilters.map((item) => ({
      ...item,
      label: mockText(2),
      hintMessage: mockText(4),
      warnMessage: randomNumber() > 80 && mockText(4),
      errorMessage: randomNumber() > 80 && mockText(4),
      value:
        item.key === 'input'
          ? mockText(2)
          : item.key === 'social'
          ? 'https://www.facebook.com/' + mockText(1)
          : item.key === 'timePicker'
          ? mockTime()
          : item.key === 'dateRange'
          ? { from: mockISOdate(), to: mockISOdate() }
          : null,
      options:
        item.key === 'singleSelect'
          ? selectOneRandom(SSoptionsMock)
          : item.key === 'multiSelect'
          ? selectRandom(MSoptionsMock)
          : null,
      disabled: randomNumber() > 90,
      required: randomNumber() > 50,
      type:
        item.key === 'social'
          ? randomFromArray(Object.values(Social))
          : item.key === 'dateRange'
          ? randomFromArray(Object.values(DatepickerType))
          : item.key === 'input'
          ? randomFromArray(Object.values(InputTypes))
          : null,
    }));
  }

  changeShow() {
    Object.keys(this.show).forEach((i) => {
      this.show[i] = randomNumber() > 70;
    });
  }

  changeShowAll() {
    this.allShown = !this.allShown;
    Object.keys(this.show).forEach((i) => {
      this.show[i] = this.allShown;
    });
  }

  ngOnInit() {
    setInterval(() => {
      if (this.enblInterval) {
        this.changeShow();
        this.cd.detectChanges();
      }
    }, 8000);
    setInterval(() => {
      if (this.enblInterval) {
        this.changeProps();
        this.cd.detectChanges();
      }
    }, 4000);
  }
}

@NgModule({
  declarations: [FilterBarTestComponent],
  exports: [FilterBarTestComponent],
  imports: [
    BrowserModule,
    ButtonsModule,
    FormsModule,
    CommonModule,
    NoopAnimationsModule,
    QuickFilterLayoutModule,
    InputModule,
    MultiSelectModule,
    SingleSelectModule,
    SocialModule,
    DateRangePickerModule,
    TimePickerModule,
    SplitInputSingleSelectModule,
  ],
  providers: [],
  entryComponents: [],
})
export class FilterBarTestModule {}
