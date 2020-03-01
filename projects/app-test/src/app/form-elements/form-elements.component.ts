import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  SimpleChange,
  ElementRef,
  AfterViewInit,
  ChangeDetectionStrategy,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  isString,
  countChildren,
  getType,
  makeArray,
} from '../../../../ui-framework/src/lib/services/utils/functional-utils';
import {
  truthyOrFalse,
  arrayOfStringsOrArrayFromString,
  valueToObjectWithKeyOfValueFromArray,
  valueAsNumber,
  stringListToArray,
} from '../../../../ui-framework/src/lib/services/utils/transformers';
import {
  mockHobbies,
  mockJobs,
  mockName,
} from '../../../../ui-framework/src/lib/mock.const';
import { distinctUntilChanged } from 'rxjs/operators';
import { isEqual } from 'lodash';
import { BlotType } from '../../../../ui-framework/bob-rte/src/rte/rte.enum';

import {
  compose as _compose,
  isArray as _isArray,
  isPlainObject as _isPlainObject,
  merge as _merge,
  reduce as _reduce,
  set as _set,
  toPairs as _toPairs,
} from 'lodash/fp';

export const flatten = (obj, path = []) => {
  return _isPlainObject(obj) || _isArray(obj)
    ? _reduce(
        (acc, [k, v]) => _merge(acc, flatten(v, [...path, k])),
        {},
        _toPairs(obj)
      )
    : { [path.join('.')]: obj };
};

export const unflatten = _compose(
  _reduce((acc, [k, v]) => _set(k, v, acc), {}),
  _toPairs
);

@Component({
  selector: 'app-form-elements-test',
  templateUrl: './form-elements.component.html',
  styleUrls: ['./form-elements.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormElementsTestComponent
  implements OnInit, OnDestroy, AfterViewInit {
  constructor(private zone: NgZone, private cd: ChangeDetectorRef) {}

  parseInt = parseInt;

  allFormElements = [
    'bInput',
    'bTextarea',
    'bDatepicker',
    'bChipinput',
    'bSocial',
    'bCheckbox',
    'bRadio',
    'bSingleSelect',
    'bMultiSelect',
    'bSplitInput',
    'bRTE',
  ];

  global_visibleComponents = this.allFormElements.reduce((acc, comp) => {
    return { ...acc, [comp]: true };
  }, {});

  global_formControlEnabled = true;
  global_directValueInput = false;
  global_setInputProgrammatically = false;
  global_setValEmit = true;
  global_disabled = false;
  global_required = true;
  global_maxChars = 30;
  global_numberOfCustEvents = 1;
  global_consoleLog = true;
  global_hideLabelOnFocus = false;
  global_setGlobalFormControlValueStrategy = 'runComponentNgOnChanges';
  global_disco = false;

  globalFormControlStartValues = {
    null: null,
    empty: '',
    undefined: undefined,
    string: 'Some value',
    number: 123,
    true: true,
    false: false,
    array: ['a', 'b', 'c'],
    object: { a: 'a', b: 'b', c: 'c' },
    date: new Date(),
    dateString: '2019-06-16',
  };
  globalFormControlStartValue = this.globalFormControlStartValues.null;

  global_intiFormWithNull = false;

  global_warn = false;
  global_warn_value = 'Warning message';
  global_error = false;
  global_error_value = 'Error message';
  global_keepControlMenuOpen = false;
  global_ControlMenuOnBottom = false;

  timer1;
  timer2;
  timer3;

  ///////////////////////////////////

  @ViewChild('bInput') private bInput_component;
  @ViewChild('bInput', { read: ElementRef })
  private bInput_element: ElementRef;
  bInput_SubscrValue;
  bInput_EventValue;
  bInput_SubscrCounter = 0;
  bInput_EventCounter = 0;
  bInput_label = 'Input label';
  bInput_placeholder = 'Input placeholder';
  bInput_value = 'Input value';
  bInput_disabled = this.global_disabled;
  bInput_required = this.global_required;
  bInput_hint = 'Input hint text';
  bInput_warn = this.global_warn ? this.global_warn_value : '';
  bInput_error = this.global_error ? this.global_error_value : '';
  bInput_setValEmit = this.global_setValEmit;
  bInput_updateOn_mode = 'change';
  bInput_subscribtion;
  bInput_formControlEnabled = this.global_formControlEnabled;
  bInput_directValueInput = this.global_directValueInput;
  bInput_setInputProgrammatically = this.global_setInputProgrammatically;
  bInput_maxChars = this.global_maxChars;
  bInput_formSubmitted = false;
  bInput_nodeCount = 0;
  bInput_lastemitterName;
  bInput_hideLabelOnFocus = this.global_hideLabelOnFocus;

  bInput_Form = new FormGroup({
    bInput: new FormControl(
      this.global_intiFormWithNull
        ? this.globalFormControlStartValue
        : this.bInput_value,
      {
        updateOn: this.bInput_updateOn_mode as any,
      }
    ),
  });
  bInput = this.bInput_Form.get('bInput');

  ///////////////////////////////////

  @ViewChild('bTextarea') private bTextarea_component;
  @ViewChild('bTextarea', { read: ElementRef })
  private bTextarea_element: ElementRef;
  bTextarea_SubscrValue;
  bTextarea_EventValue;
  bTextarea_SubscrCounter = 0;
  bTextarea_EventCounter = 0;
  bTextarea_label = 'Textarea label';
  bTextarea_placeholder = 'Textarea placeholder';
  bTextarea_value = 'Textarea value';
  bTextarea_disabled = this.global_disabled;
  bTextarea_required = this.global_required;
  bTextarea_hint = 'Textarea hint text';
  bTextarea_warn = this.global_warn ? this.global_warn_value : '';
  bTextarea_error = this.global_error ? this.global_error_value : '';
  bTextarea_setValEmit = this.global_setValEmit;
  bTextarea_updateOn_mode = 'change';
  bTextarea_subscribtion;
  bTextarea_formControlEnabled = this.global_formControlEnabled;
  bTextarea_directValueInput = this.global_directValueInput;
  bTextarea_setInputProgrammatically = this.global_setInputProgrammatically;
  bTextarea_maxChars = this.global_maxChars;
  bTextarea_formSubmitted = false;
  bTextarea_nodeCount = 0;
  bTextarea_lastemitterName;
  bTextarea_hideLabelOnFocus = this.global_hideLabelOnFocus;

  bTextarea_Form = new FormGroup({
    bTextarea: new FormControl(
      this.global_intiFormWithNull
        ? this.globalFormControlStartValue
        : this.bTextarea_value,
      {
        updateOn: this.bTextarea_updateOn_mode as any,
      }
    ),
  });
  bTextarea = this.bTextarea_Form.get('bTextarea');

  ///////////////////////////////////

  @ViewChild('bDatepicker') private bDatepicker_component;
  @ViewChild('bDatepicker', { read: ElementRef })
  private bDatepicker_element: ElementRef;
  bDatepicker_SubscrValue;
  bDatepicker_EventValue;
  bDatepicker_SubscrCounter = 0;
  bDatepicker_EventCounter = 0;
  bDatepicker_label = 'Datepicker label';
  bDatepicker_placeholder = 'Date placeholder';
  bDatepicker_value = '02/01/2013';
  bDatepicker_dateFormat = '';
  bDatepicker_disabled = this.global_disabled;
  bDatepicker_required = this.global_required;
  bDatepicker_hint = 'Datepicker hint text';
  bDatepicker_warn = this.global_warn ? this.global_warn_value : '';
  bDatepicker_error = this.global_error ? this.global_error_value : '';
  bDatepicker_setValEmit = this.global_setValEmit;
  bDatepicker_updateOn_mode = 'change';
  bDatepicker_subscribtion;
  bDatepicker_formControlEnabled = this.global_formControlEnabled;
  bDatepicker_directValueInput = this.global_directValueInput;
  bDatepicker_setInputProgrammatically = this.global_setInputProgrammatically;
  bDatepicker_formSubmitted = false;
  bDatepicker_nodeCount = 0;
  bDatepicker_lastemitterName;
  bDatepicker_hideLabelOnFocus = this.global_hideLabelOnFocus;

  bDatepicker_Form = new FormGroup({
    bDatepicker: new FormControl(
      this.global_intiFormWithNull
        ? this.globalFormControlStartValue
        : this.bDatepicker_value,
      {
        updateOn: this.bDatepicker_updateOn_mode as any,
      }
    ),
  });
  bDatepicker = this.bDatepicker_Form.get('bDatepicker');

  ///////////////////////////////////

  @ViewChild('bChipinput') private bChipinput_component;
  @ViewChild('bChipinput', { read: ElementRef })
  private bChipinput_element: ElementRef;
  bChipinput_SubscrValue;
  bChipinput_EventValue;
  bChipinput_SubscrCounter = 0;
  bChipinput_EventCounter = 0;
  bChipinput_label = 'Chip Input label';
  bChipinput_placeholder = 'Chip Input placeholder';
  bChipinput_value = mockHobbies(3);
  bChipinput_options = mockHobbies();
  bChipinput_acceptNew = true;
  bChipinput_disabled = this.global_disabled;
  bChipinput_required = this.global_required;
  bChipinput_hint = 'Chip Input hint text';
  bChipinput_warn = this.global_warn ? this.global_warn_value : '';
  bChipinput_error = this.global_error ? this.global_error_value : '';
  bChipinput_setValEmit = this.global_setValEmit;
  bChipinput_updateOn_mode = 'change';
  bChipinput_subscribtion;
  bChipinput_formControlEnabled = this.global_formControlEnabled;
  bChipinput_directValueInput = this.global_directValueInput;
  bChipinput_setInputProgrammatically = this.global_setInputProgrammatically;
  bChipinput_formSubmitted = false;
  bChipinput_nodeCount = 0;
  bChipinput_lastemitterName;

  bChipinput_Form = new FormGroup({
    bChipinput: new FormControl(
      this.global_intiFormWithNull
        ? this.globalFormControlStartValue
        : this.bChipinput_value,
      {
        updateOn: this.bChipinput_updateOn_mode as any,
      }
    ),
  });
  bChipinput = this.bChipinput_Form.get('bChipinput');

  ///////////////////////////////////

  @ViewChild('bSocial') private bSocial_component;
  @ViewChild('bSocial', { read: ElementRef })
  private bSocial_element: ElementRef;
  bSocial_SubscrValue;
  bSocial_EventValue;
  bSocial_SubscrCounter = 0;
  bSocial_EventCounter = 0;
  bSocial_type = 'facebook';
  bSocial_label = 'Social Input label';
  bSocial_placeholder = 'Your Name';
  bSocial_value = 'https://www.facebook.com/galloween';
  bSocial_disabled = this.global_disabled;
  bSocial_required = this.global_required;
  bSocial_hint = 'Social Input hint text';
  bSocial_warn = this.global_warn ? this.global_warn_value : '';
  bSocial_error = this.global_error ? this.global_error_value : '';
  bSocial_setValEmit = this.global_setValEmit;
  bSocial_updateOn_mode = 'change';
  bSocial_subscribtion;
  bSocial_formControlEnabled = this.global_formControlEnabled;
  bSocial_directValueInput = this.global_directValueInput;
  bSocial_setInputProgrammatically = this.global_setInputProgrammatically;
  bSocial_formSubmitted = false;
  bSocial_nodeCount = 0;
  bSocial_lastemitterName;
  bSocial_hideLabelOnFocus = this.global_hideLabelOnFocus;

  bSocial_Form = new FormGroup({
    bSocial: new FormControl(
      this.global_intiFormWithNull
        ? this.globalFormControlStartValue
        : this.bSocial_value,
      {
        updateOn: this.bSocial_updateOn_mode as any,
      }
    ),
  });
  bSocial = this.bSocial_Form.get('bSocial');

  ///////////////////////////////////

  @ViewChild('bCheckbox') private bCheckbox_component;
  @ViewChild('bCheckbox', { read: ElementRef })
  private bCheckbox_element: ElementRef;
  bCheckbox_SubscrValue;
  bCheckbox_EventValue;
  bCheckbox_SubscrCounter = 0;
  bCheckbox_EventCounter = 0;
  bCheckbox_label = 'Checkbox label';
  bCheckbox_placeholder = 'Checkbox Placeholder';
  bCheckbox_value = true; // 'true';
  bCheckbox_indeterminate = false;
  bCheckbox_disabled = this.global_disabled;
  bCheckbox_required = this.global_required;
  bCheckbox_hint = 'Checkbox hint';
  bCheckbox_warn = this.global_warn ? this.global_warn_value : '';
  bCheckbox_error = this.global_error ? this.global_error_value : '';
  bCheckbox_setValEmit = this.global_setValEmit;
  bCheckbox_updateOn_mode = 'change';
  bCheckbox_subscribtion;
  bCheckbox_formControlEnabled = this.global_formControlEnabled;
  bCheckbox_directValueInput = this.global_directValueInput;
  bCheckbox_setInputProgrammatically = this.global_setInputProgrammatically;
  bCheckbox_formSubmitted = false;
  bCheckbox_nodeCount = 0;
  bCheckbox_lastemitterName;

  bCheckbox_Form = new FormGroup({
    bCheckbox: new FormControl(
      this.global_intiFormWithNull
        ? this.globalFormControlStartValue
        : this.bCheckbox_value,
      {
        updateOn: this.bCheckbox_updateOn_mode as any,
      }
    ),
  });
  bCheckbox = this.bCheckbox_Form.get('bCheckbox');

  ///////////////////////////////////

  bRadio_optionsMock = {
    array: ['Option one', 'Option two', 'Option three'],
    radioConfig: [
      { id: 11, label: 'option 1' },
      { id: 12, label: 'option 2' },
      { id: 13, label: 'option 3' },
      { id: 'option 4' },
    ],
  };

  @ViewChild('bRadio') private bRadio_component;
  @ViewChild('bRadio', { read: ElementRef })
  private bRadio_element: ElementRef;
  bRadio_SubscrValue;
  bRadio_EventValue;
  bRadio_SubscrCounter = 0;
  bRadio_EventCounter = 0;
  bRadio_label = 'Radio button label';
  bRadio_value = { id: 11, label: 'option 1' };
  bRadio_optionsType = 'radioConfig';
  bRadio_options = this.bRadio_optionsMock[this.bRadio_optionsType];
  bRadio_direction = 'row';
  bRadio_disabled = this.global_disabled;
  bRadio_required = this.global_required;
  bRadio_hint = 'Radio hint';
  bRadio_warn = this.global_warn ? this.global_warn_value : '';
  bRadio_error = this.global_error ? this.global_error_value : '';
  bRadio_setValEmit = this.global_setValEmit;
  bRadio_updateOn_mode = 'change';
  bRadio_subscribtion;
  bRadio_formControlEnabled = this.global_formControlEnabled;
  bRadio_directValueInput = this.global_directValueInput;
  bRadio_setInputProgrammatically = this.global_setInputProgrammatically;
  bRadio_formSubmitted = false;
  bRadio_nodeCount = 0;
  bRadio_lastemitterName;

  bRadio_Form = new FormGroup({
    bRadio: new FormControl(
      this.global_intiFormWithNull
        ? this.globalFormControlStartValue
        : this.bRadio_value,
      {
        updateOn: this.bRadio_updateOn_mode as any,
      }
    ),
  });
  bRadio = this.bRadio_Form.get('bRadio');

  ///////////////////////////////////

  groupNum = 2;
  optionsNum = 3;
  groupNames = mockJobs();

  bSingleSelect_optionsMock = makeArray(this.groupNum).map((group, index) => {
    const groupId = index;

    return {
      groupName: this.groupNames[index],
      key: groupId,

      options: makeArray(this.optionsNum).map((option, index) => ({
        id: groupId * this.optionsNum + index,
        value: mockName(),
        selected: false,
        disabled: false,
      })),
    };
  });

  @ViewChild('bSingleSelect')
  private bSingleSelect_component;
  @ViewChild('bSingleSelect', { read: ElementRef })
  private bSingleSelect_element: ElementRef;
  bSingleSelect_SubscrValue;
  bSingleSelect_EventValue;
  bSingleSelect_SubscrCounter = 0;
  bSingleSelect_EventCounter = 0;

  bSingleSelect_label = 'Input label';
  bSingleSelect_placeholder = 'Input placeholder';
  bSingleSelect_value = undefined;

  bSingleSelect_options = this.bSingleSelect_optionsMock;
  bSingleSelect_showSingleGroupHeader = false;
  bSingleSelect_showNoneOption = true;

  bSingleSelect_disabled = this.global_disabled;
  bSingleSelect_required = this.global_required;
  bSingleSelect_hint = 'Input hint text';
  bSingleSelect_warn = this.global_warn ? this.global_warn_value : '';
  bSingleSelect_error = this.global_error ? this.global_error_value : '';
  bSingleSelect_setValEmit = this.global_setValEmit;
  bSingleSelect_updateOn_mode = 'change';
  bSingleSelect_subscribtion;
  bSingleSelect_formControlEnabled = this.global_formControlEnabled;
  bSingleSelect_directValueInput = this.global_directValueInput;
  bSingleSelect_setInputProgrammatically = this.global_setInputProgrammatically;
  bSingleSelect_formSubmitted = false;
  bSingleSelect_nodeCount = 0;
  bSingleSelect_lastemitterName;
  bSingleSelect_numberOfCustEvents = 1;
  bSingleSelect_hideLabelOnFocus = this.global_hideLabelOnFocus;

  bSingleSelect_Form = new FormGroup({
    bSingleSelect: new FormControl(
      this.global_intiFormWithNull
        ? this.globalFormControlStartValue
        : this.bSingleSelect_value,
      {
        updateOn: this.bSingleSelect_updateOn_mode as any,
      }
    ),
  });
  bSingleSelect = this.bSingleSelect_Form.get('bSingleSelect');

  ///////////////////////////////////

  bMultiSelect_groupNum = 2;
  bMultiSelect_optionsNum = 3;

  bMultiSelect_optionsMock = makeArray(this.bMultiSelect_groupNum).map(
    (group, index) => {
      const groupId = index;

      return {
        groupName: this.groupNames[index],
        key: groupId,

        options: makeArray(this.bMultiSelect_optionsNum).map(
          (option, index) => ({
            id: groupId * this.bMultiSelect_optionsNum + index,
            value: mockName(),
            selected: false,
            disabled: false,
          })
        ),
      };
    }
  );

  @ViewChild('bMultiSelect') private bMultiSelect_component;
  @ViewChild('bMultiSelect', { read: ElementRef })
  private bMultiSelect_element: ElementRef;
  bMultiSelect_SubscrValue;
  bMultiSelect_EventValue;
  bMultiSelect_SubscrCounter = 0;
  bMultiSelect_EventCounter = 0;

  bMultiSelect_label = 'Input label';
  bMultiSelect_placeholder = 'Input placeholder';

  bMultiSelect_value = undefined;
  bMultiSelect_options = this.bMultiSelect_optionsMock;
  bMultiSelect_showSingleGroupHeader = false;

  bMultiSelect_disabled = this.global_disabled;
  bMultiSelect_required = this.global_required;
  bMultiSelect_hint = 'Input hint text';
  bMultiSelect_warn = this.global_warn ? this.global_warn_value : '';
  bMultiSelect_error = this.global_error ? this.global_error_value : '';
  bMultiSelect_setValEmit = this.global_setValEmit;
  bMultiSelect_updateOn_mode = 'change';
  bMultiSelect_subscribtion;
  bMultiSelect_formControlEnabled = this.global_formControlEnabled;
  bMultiSelect_directValueInput = this.global_directValueInput;
  bMultiSelect_setInputProgrammatically = this.global_setInputProgrammatically;
  bMultiSelect_formSubmitted = false;
  bMultiSelect_nodeCount = 0;
  bMultiSelect_lastemitterName;
  bMultiSelect_numberOfCustEvents = 1;
  bMultiSelect_hideLabelOnFocus = this.global_hideLabelOnFocus;

  bMultiSelect_Form = new FormGroup({
    bMultiSelect: new FormControl(
      this.global_intiFormWithNull
        ? this.globalFormControlStartValue
        : this.bMultiSelect_value,
      {
        updateOn: this.bMultiSelect_updateOn_mode as any,
      }
    ),
  });
  bMultiSelect = this.bMultiSelect_Form.get('bMultiSelect');

  ///////////////////////////////////

  currencies = [
    { value: 'AED', serverId: null },
    { value: 'ANG', serverId: null },
    { value: 'AUD', serverId: null },
    { value: 'AZN', serverId: null },
    { value: 'BAM', serverId: null },
    { value: 'BGN', serverId: null },
    { value: 'BRL', serverId: null },
    { value: 'BTC', serverId: null },
    { value: 'BWP', serverId: null },
    { value: 'CAD', serverId: null },
    { value: 'CHF', serverId: null },
    { value: 'CLP', serverId: null },
    { value: 'CNY', serverId: null },
    { value: 'COP', serverId: null },
    { value: 'CZK', serverId: null },
    { value: 'DKK', serverId: null },
    { value: 'EGP', serverId: null },
    { value: 'EUR', serverId: null },
    { value: 'GBP', serverId: null },
    { value: 'HKD', serverId: null },
    { value: 'HUF', serverId: null },
    { value: 'IDR', serverId: null },
    { value: 'ILS', serverId: null },
    { value: 'INR', serverId: null },
    { value: 'JPY', serverId: null },
    { value: 'KES', serverId: null },
    { value: 'KRW', serverId: null },
    { value: 'MAD', serverId: null },
    { value: 'MMK', serverId: null },
    { value: 'MXN', serverId: null },
    { value: 'MYR', serverId: null },
    { value: 'NGN', serverId: null },
    { value: 'NOK', serverId: null },
    { value: 'NPR', serverId: null },
    { value: 'NZD', serverId: null },
    { value: 'PEN', serverId: null },
    { value: 'PHP', serverId: null },
    { value: 'PLN', serverId: null },
    { value: 'RON', serverId: null },
    { value: 'RUB', serverId: null },
    { value: 'SEK', serverId: null },
    { value: 'SGD', serverId: null },
    { value: 'THB', serverId: null },
    { value: 'TRY', serverId: null },
    { value: 'TWD', serverId: null },
    { value: 'TZS', serverId: null },
    { value: 'UAH', serverId: null },
    { value: 'USD', serverId: null },
    { value: 'UYU', serverId: null },
    { value: 'VND', serverId: null },
    { value: 'XOF', serverId: null },
    { value: 'ZAR', serverId: null },
  ];

  bSplitInput_optionsMock = Array.from(Array(1), (_, i) => {
    return {
      groupName: 'all currencies',
      options: this.currencies.map(currency => ({
        value: currency.value,
        id: currency.value,
        selected: null,
      })),
    };
  });

  bSplitInput_startValue = {
    inputValue: 100,
    selectValue: 'AED',
  };

  @ViewChild('bSplitInput') private bSplitInput_component;
  @ViewChild('bSplitInput', { read: ElementRef })
  private bSplitInput_element: ElementRef;
  bSplitInput_SubscrValue;
  bSplitInput_EventValue;
  bSplitInput_SubscrCounter = 0;
  bSplitInput_EventCounter = 0;
  bSplitInput_label = 'Input label';
  bSplitInput_placeholder = 'Input placeholder';
  bSplitInput_value = undefined;
  bSplitInput_selectOptions = this.bSplitInput_optionsMock;
  bSplitInput_disabled = this.global_disabled;
  bSplitInput_required = this.global_required;
  bSplitInput_hint = 'Input hint text';
  bSplitInput_warn = this.global_warn ? this.global_warn_value : '';
  bSplitInput_error = this.global_error ? this.global_error_value : '';
  bSplitInput_setValEmit = this.global_setValEmit;
  bSplitInput_updateOn_mode = 'change';
  bSplitInput_subscribtion;
  bSplitInput_formControlEnabled = this.global_formControlEnabled;
  bSplitInput_directValueInput = this.global_directValueInput;
  bSplitInput_setInputProgrammatically = this.global_setInputProgrammatically;
  bSplitInput_formSubmitted = false;
  bSplitInput_nodeCount = 0;
  bSplitInput_lastemitterName;
  bSplitInput_hideLabelOnFocus = this.global_hideLabelOnFocus;

  bSplitInput_Form = new FormGroup({
    bSplitInput: new FormControl(
      this.global_intiFormWithNull
        ? this.globalFormControlStartValue
        : this.bSplitInput_value,
      {
        updateOn: this.bSplitInput_updateOn_mode as any,
      }
    ),
  });
  bSplitInput = this.bSplitInput_Form.get('bSplitInput');

  ///////////////////////////////////

  // tslint:disable-next-line: max-line-length
  RTEvalueMock = `<div> <span style="color: red;">Hello</span> <a href="http://www.google.com">World</a>!</div>
<div>Some <em>initial</em> <strong>bold</strong> text</div> {{/work/title}}`;

  placeholderMock = [
    {
      groupName: 'Basic Info - header',
      options: [
        {
          displayName: 'First name',
          id: '/root/firstName',
          value: 'First name',
        },
        {
          displayName: 'title',
          id: '/work/title',
          category: 'Work',
          value: 'title',
        },
      ],
    },
  ];

  bRTE_disableControlsDef = []; // = [BlotType.align, BlotType.direction];
  bRTE_controlsDef = Object.values(BlotType).filter(
    cntrl => !this.bRTE_disableControlsDef.includes(cntrl)
  );

  @ViewChild('bRTE') private bRTE_component;
  @ViewChild('bRTE', { read: ElementRef })
  private bRTE_element: ElementRef;
  bRTE_SubscrValue;
  bRTE_EventValue;
  bRTE_SubscrCounter = 0;
  bRTE_EventCounter = 0;

  bRTE_type = 'primary';
  bRTE_value = this.RTEvalueMock;

  bRTE_controls = this.bRTE_controlsDef;
  bRTE_disableControls = this.bRTE_disableControlsDef;
  bRTE_placeholderList = this.placeholderMock;

  bRTE_label = 'Rich text label';
  bRTE_placeholder = 'RTE Placeholder';
  bRTE_maxChars = 100;
  bRTE_minChars = 20;

  bRTE_disabled = this.global_disabled;
  bRTE_required = this.global_required;
  bRTE_hint = 'Rich text hint text';
  bRTE_warn = this.global_warn ? this.global_warn_value : '';
  bRTE_error = this.global_error ? this.global_error_value : '';

  bRTE_setValEmit = this.global_setValEmit;
  bRTE_updateOn_mode = 'blur';
  bRTE_subscribtion;
  bRTE_formControlEnabled = this.global_formControlEnabled;
  bRTE_directValueInput = this.global_directValueInput;
  bRTE_setInputProgrammatically = this.global_setInputProgrammatically;
  bRTE_formSubmitted = false;
  bRTE_nodeCount = 0;
  bRTE_lastemitterName;

  bRTE_Form = new FormGroup({
    bRTE: new FormControl(
      this.global_intiFormWithNull
        ? this.globalFormControlStartValue
        : this.bRTE_value,
      {
        updateOn: this.bRTE_updateOn_mode as any,
      }
    ),
  });
  bRTE = this.bRTE_Form.get('bRTE');

  ///////////////////////////////////

  truthyOrFalse = truthyOrFalse;
  arrayOfStringsOrArrayFromString = arrayOfStringsOrArrayFromString;
  valueToObjectWithKeyOfValueFromArray = valueToObjectWithKeyOfValueFromArray;

  ///////////////////////////////////

  asString(value) {
    return isString(value) ? value : JSON.stringify(value);
  }

  setValue(name, value: any = NaN) {
    if (value !== value) {
      value = this[name + '_value'];
    }
    if (this[name]) {
      this[name].setValue(value, {
        emitEvent: this[name + '_setValEmit'],
      });
    }
  }

  runComponentNgOnChanges(name, value: any = NaN, prop = 'value') {
    if (value !== value) {
      value = this[name + '_value'];
    }
    // this[name + '_component'].value = value;
    this[name + '_component'].ngOnChanges({
      [prop]: new SimpleChange(null, value, false),
    });
  }

  setComponentProp(name, prop = 'value', value: any = NaN) {
    if (value !== value) {
      value = this[name + '_value'];
    }
    if (this[name + '_component']) {
      this[name + '_component'][prop] = value;
    }
  }

  getComponentProp(name, prop = 'value') {
    if (this[name + '_component']) {
      return this[name + '_component'][prop];
    }
  }

  setGlobalFormControlValue(event) {
    const val = this.globalFormControlStartValues[event.target.value];
    this.globalFormControlStartValue = val;

    this.allFormElements.forEach(name => {
      if (this.global_visibleComponents[name]) {
        this[name + '_value'] = val;
        if (this.global_consoleLog) {
          console.log('--------<<<<<<<<-----------');
          console.log(
            'Setting value of ' + name + ' to ' + getType(val) + ':',
            val
          );
        }
        this[this.global_setGlobalFormControlValueStrategy](name, val);
      }
    });
  }

  setGlobalFormControlValueToEach() {
    let counter = 0;
    Object.keys(this.globalFormControlStartValues).forEach(key => {
      setTimeout(() => {
        this.setGlobalFormControlValue({ target: { value: key } });
      }, 100 * ++counter);
    });
  }

  onValueInput(name, event = null, parse = false, value: any = NaN) {
    value = value === value ? value : event.target.value;
    value = parse ? JSON.parse(value as any) : value;

    if (this[name + '_setInputProgrammatically']) {
      event && event.preventDefault();
      this.runComponentNgOnChanges(name, value);
    } else {
      this[name + '_value'] = value;
    }
  }

  onSelectValueInput(name, event = null) {
    const value = event.target.value
      ? stringListToArray(event.target.value).map(val =>
          valueAsNumber(true, val)
        )
      : null;

    this.onValueInput(name, event, null, value);
  }

  onEvent(name, $event, emitterName, flat = false) {
    $event = this.asString($event);

    const max =
      this[name + '_numberOfCustEvents'] || this.global_numberOfCustEvents;

    let value =
      max === 1
        ? typeof $event === 'string' && $event.length > 150
          ? $event.substring(0, 150) + '...'
          : $event
        : (this[name + '_EventValue']
            ? this[name + '_EventValue'].split('\n').slice((max - 1) * -1) +
              ' \n '
            : '') +
          (typeof $event === 'string' && $event.length > 150
            ? $event.substring(0, 150) + '...'
            : $event);

    if (max === 1 && flat) {
      value = flatten(value as any);
    }

    this[name + '_EventValue'] = value;
    this[name + '_EventCounter']++;
    this[name + '_lastemitterName'] = emitterName;

    if (this.global_consoleLog) {
      console.log('-------->>>>>>>>-----------');
      console.log(
        name +
          ' custom event (' +
          emitterName +
          ') ' +
          this[name + '_EventCounter'] +
          ':'
      );
      console.log($event);
    }

    setTimeout(() => {
      this.cd.detectChanges();
    }, 0);
  }

  subscribeToValueChanges(name) {
    this[name + '_subscribtion'] =
      this[name] &&
      this[name].valueChanges
        .pipe(distinctUntilChanged(isEqual))
        .subscribe(value => {
          value = this.asString(value);
          this[name + '_SubscrValue'] = value;
          this[name + '_SubscrCounter']++;
          if (this.global_consoleLog) {
            console.log('-------->>>>>>>>-----------');
            console.log(
              name + ' valueChanges ' + this[name + '_SubscrCounter'] + ':'
            );
            console.log(this[name + '_SubscrValue']);
          }
          this.cd.detectChanges();
        });
  }

  unSubscribeFromValueChanges(name) {
    this[name + '_subscribtion'].unsubscribe();
  }

  subscribeToAll(names) {
    names.forEach(name => {
      this.subscribeToValueChanges(name);
    });
  }

  unSubscribeFromAll(names) {
    names.forEach(name => {
      this.unSubscribeFromValueChanges(name);
    });
  }

  setUpdateOnMode(name, mode) {
    const value = this[name + '_Form'].get(name).value;
    this[name + '_formControlEnabled'] = false;
    setTimeout(() => {
      this[name + '_formControlEnabled'] = true;
      const newControl = new FormControl(value, {
        updateOn: mode,
      });
      this[name + '_Form'].setControl(name, newControl);
      this[name] = this[name + '_Form'].get(name);
      this.unSubscribeFromValueChanges(name);
      this.subscribeToValueChanges(name);
      this.cd.detectChanges();
    }, 10);
  }

  globalControlChange(control, value: any = NaN) {
    if (value !== value) {
      if (control.includes('error') || control.includes('warn')) {
        value = this[control + '_value'];
      } else {
        value = this[control];
      }
    }
    if (control.includes('_')) {
      control = control.split('_')[1];
    }
    if (this.global_consoleLog && value) {
      console.log('setting all components', control, 'to', value);
    }
    this.allFormElements.forEach(name => {
      this[name + '_' + control] = value;
      // this.cd.detectChanges();
    });
  }

  globalClearWarnErrors() {
    this.global_error = false;
    this.global_warn = false;
    this.allFormElements.forEach(name => {
      this[name + '_warn'] = '';
      this[name + '_error'] = '';
    });
  }

  inverseVisibleComponents() {
    Object.keys(this.global_visibleComponents).forEach(key => {
      this.global_visibleComponents[key] = !this.global_visibleComponents[key];
    });
  }

  showComponents(comps) {
    comps.forEach(comp => {
      this.global_visibleComponents[comp] = true;
      this.countKids(comp);
    });
  }

  hideComponents(comps) {
    comps.forEach(comp => {
      this.global_visibleComponents[comp] = false;
    });
  }

  getProp(prop) {
    return this[prop];
  }

  resetValue(name, vari) {
    this[name + '_value'] = this[vari];
  }

  onSubmit(event, name) {
    if (!this[name + '_Form'].valid) {
      event.preventDefault();
      return false;
    }

    this[name + '_formSubmitted'] = true;
    if (this.global_consoleLog) {
      console.log('--------<><><><>-----------');
      console.log(name + ' form submitted.');
      console.log(this[name + '_Form'].value);
    }
  }

  onSubmitClick(name) {
    const form = document.querySelector(
      'section.' + name + ' form'
    ) as HTMLFormElement;

    let submitButton = document.querySelector(
      'section.' + name + ' .hidden-submit'
    ) as HTMLElement;

    if (!submitButton) {
      submitButton = document.createElement('button');
      (submitButton as any).type = 'submit';
      submitButton.id = 'hidden-submit-' + name;
      submitButton.className = 'hidden-submit';
      submitButton.style.opacity = '0';
      submitButton.style.position = 'absolute';
      submitButton.style.border = '0';
      submitButton.style.padding = '0';
      submitButton.style.overflow = 'hidden';
      submitButton.style.width = '1px';
      submitButton.style.height = '1px';
      submitButton.style.clip = 'rect(0 0 0 0)';
      submitButton.style.margin = '-1px';
      submitButton = form.appendChild(submitButton) as HTMLElement;
    }

    submitButton.click();
  }

  logEvent(event) {
    console.log(event);
  }

  logComponent(name) {
    console.log(this[name + '_component']);
  }

  logComponentProp(name, prop = 'value') {
    console.log(this[name + '_component'][prop]);
  }

  logProp(name) {
    console.log(this[name]);
  }

  logFlattenedObject(prop) {
    console.log(flatten(this[prop]));
  }

  type = smth => getType(smth);

  countKids(name) {
    setTimeout(() => {
      this[name + '_nodeCount'] = countChildren(
        null,
        this[name + '_element'] && this[name + '_element'].nativeElement
      );
      this.cd.detectChanges();
    }, 0);
  }

  doDisco() {
    if (this.global_disco) {
      console.log('DISCO! GO!');

      this.timer1 = setInterval(() => {
        this.globalControlChange('disabled', false);
        this.globalControlChange('warn', this.global_warn_value);
        this.globalControlChange('error', null);
      }, 500);

      this.timer2 = setInterval(() => {
        this.globalControlChange('disabled', false);
        this.globalControlChange('warn', null);
        this.globalControlChange('error', this.global_error_value);
      }, 1000);

      this.timer3 = setInterval(() => {
        this.globalClearWarnErrors();
        this.globalControlChange('disabled', true);
      }, 1500);
    } else {
      console.log('DISCO! STOP!');
      clearInterval(this.timer1);
      clearInterval(this.timer2);
      clearInterval(this.timer3);
      this.timer1 = null;
      this.timer2 = null;
      this.timer3 = null;
      this.globalClearWarnErrors();
      this.globalControlChange('disabled', false);
    }
  }

  ///////////////////////////////////

  ngOnInit() {
    this.subscribeToAll(this.allFormElements);

    this.hideComponents(this.allFormElements);
    this.showComponents(['bRTE']);

    // 'bInput'
    // 'bTextarea'
    // 'bDatepicker'
    // 'bChipinput'
    // 'bSocial'
    // 'bCheckbox'
    // 'bRadio'
    // 'bSingleSelect'
    // 'bMultiSelect'
    // 'bSplitInput'
    // 'bRTE'

    this.bSingleSelect_options[0].options[1].selected = true;
    this.bMultiSelect_optionsMock[0].options[1].selected = true;
    this.bMultiSelect_optionsMock[1].options[2].selected = true;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.allFormElements.forEach(name => {
        this.setComponentProp(name, 'wrapEvent', true);
      });

      this.allFormElements.forEach(name => this.countKids(name));
      this.cd.detectChanges();
    }, 0);
  }

  ngOnDestroy() {
    this.unSubscribeFromAll(this.allFormElements);
  }
}
