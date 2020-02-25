import { storiesOf } from '@storybook/angular';
import { boolean, object, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QuickFilterLayoutModule } from './quick-filter-layout.module';
import { MultiSelectModule } from '../../lists/multi-select/multi-select.module';
import { SingleSelectModule } from '../../lists/single-select/single-select.module';
import { DateRangePickerModule } from '../../form-elements/date-picker/date-range-picker/date-range-picker.module';
import { AvatarModule } from '../../avatar/avatar/avatar.module';
import {
  mockThings,
  mockAnimals,
  mockName,
  mockHobbies,
} from '../../mock.const';
import { simpleUID } from '../../services/utils/functional-utils';
import { ButtonsModule } from '../../buttons/buttons.module';
import { QuickFilterConfig } from '../quick-filter/quick-filter.interface';
import { InputModule } from '../../form-elements/input/input.module';
import { SocialModule } from '../../form-elements/social/social.module';
import { TimePickerModule } from '../../form-elements/timepicker/timepicker.module';
import { InputTypes } from '../../form-elements/input/input.enum';
// tslint:disable-next-line: max-line-length
import { SplitInputSingleSelectModule } from '../../form-elements/split-input-single-select/split-input-single-select.module';
import { LinkColor } from '../../indicators/link/link.enum';
import { DatepickerType } from '../../form-elements/date-picker/datepicker.enum';

import { BDateAdapterMock } from '../../form-elements/date-picker/dateadapter.mock';
import { AvatarImageComponent } from '../../avatar/avatar/avatar-image/avatar-image.component';

const story = storiesOf(ComponentGroupType.Search, module).addDecorator(
  withKnobs
);

const template1 = `
<b-quick-filter-layout
            [showResetFilter]="showResetFilter"
            (resetFilters)="resetFilters()"
            (filtersChange)="filtersChange($event)">

    <b-text-button bar-prefix *ngIf="showLeftButt"
                   [text]="'Left'" [color]="linkColor.primary">
    </b-text-button>

    <b-single-select
            [id]="'Some stuff'"
            [label]="'Select here'" [placeholder]="'Some stuff'"
            [options]="BSSoptions">
    </b-single-select>

    <b-multi-select [id]="'More stuff'"
            [label]="'Then select here'" [placeholder]="'More stuff'"
            [options]="BMSoptions">
    </b-multi-select>

    <b-date-range-picker [id]="'Date Range'" [type]="datepickerType.date"
            [label]="'Pick date range'"
            [startDateLabel]="'From'"
            [endDateLabel]="'To'">
    </b-date-range-picker>

    <b-text-button bar-suffix *ngIf="showRightButt"
                   [text]="'Right'" [color]="linkColor.primary">
    </b-text-button>

</b-quick-filter-layout>
`;

const template2 = `
<b-quick-filter-layout
            [quickFilters]="quickFilters"
            [showResetFilter]="showResetFilter"
            (filtersChange)="filtersChange($event)">

    <b-input *ngIf="showName" [id]="'name'"></b-input>

    <b-split-input-single-select *ngIf="showSplitInpSel"
            [id]="'split'">
    </b-split-input-single-select>

    <b-multi-select *ngIf="showHobbies" [id]="'hobbies'">
    </b-multi-select>

    <b-social *ngIf="showSocial" [id]="'social'"></b-social>

    <b-timepicker *ngIf="showTime" [id]="'time'"></b-timepicker>

</b-quick-filter-layout>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Quick Filter Layout'" style="background-color: rgb(247,247,247);">
  <div style="max-width: calc(100vw - 100px);">
    ${template1}
    <br><br>
    ${template2}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Quick Filter Layout
  #### QuickFilterLayoutModule
  *QuickFilterModule*

  -----------

  <span style="font-size: 110%">
  <strong>Quick Filter Layout can be used in two ways:</strong> <br>

  - Consumer can provide (via ng-content) any number of form elements and manage ther\
   bindings <u>manually</u>.<br> The layout component will collect all change events and\
    output as single object via \`(filtersChange)\`.

  - Consumer can provide the form elements, and \`[quickFilters]\`  QuickFilterConfig array.\
   Elements will be initialized/bound  <u>automatically</u> according to QuickFilterConfig's.<br>\
    Change events from all components are combined into single \`(filtersChange)\` output.
  <br>
  Form elements and/or QuickFilterConfig's can be added/updated dynamically.
  </span>

  <strong><u>Note:</u></strong>
    There is a seemingly weird behaviour: on init, all form \
    elements inside Quick Filter Layout will emit change event with value of **NaN**.<br>\
     This is needed to propagate/update \
    properties bound from QuickFilterConfig. <br>\
    If it gets in the way, you can filter it out in your event handlers:

~~~
onChange(event){
    if (event === event) { // NaN === NaN is always false
      doStuff();
    }
}
~~~


  -----------

  ### Using just for layout (consumer provides all functionality)

  ~~~
  ${template1}
  ~~~

  #### Properties
  Name | Type | Description | Default Value
  --- | --- | --- | ---
  [showResetFilter] | boolean | displays reset button (consumer needs to provide functionality) | false
  (resetFilters) | EventEmitter<wbr>&lt;void&gt; | emits on reset click. | &nbsp;
  (filtersChange) | EventEmitter<wbr>&lt;GenericObject&gt; | emits on quick filter bar change, \
  includes current value of all the form elements: \`\`\`{[key: string]: any}\`\`\` | &nbsp;
  &lt;b-form-element [id]="id"&gt; | ng-content | Any number of any form-elements. \
  Consumer has to manage its bindings and events herself.\
   \`\`\`[id]\`\`\` property is recommended but not mandatory. | &nbsp;
  &lt;b-button-element <br>bar-prefix&gt; | ng-content | Button to be displayed on the left of the bar\
  (consumer provides functionality)  | &nbsp;
  &lt;b-button-element <br>bar-suffix&gt; | ng-content | Button to be displayed on the right of the bar \
  (consumer provides functionality) | &nbsp;

  -----------

  ### Using with [quickFilters] and (filtersChange)

  Only [id] prop needs to be provided on the form elements, the rest props are bound via QuickFilterConfig.

  ~~~
  ${template2}
  ~~~

  #### Properties
  Name | Type | Description | Default Value
  --- | --- | --- | ---
  [quickFilters] | QuickFilterConfig[] | array properties (and/or state) to be applied to form elements, \
  where \`\`\`.key\`\`\` of QuickFilterConfig is matched to \`\`\`.id\`\`\` of the form component  | &nbsp;
  [showResetFilter] | boolean | displays reset button | false
  (resetFilters) | EventEmitter<wbr>&lt;void&gt; | emits on reset click.<br> \
  <strong>Note!</strong><br> If there are no listeners to (resetFilters) and [showResetFilter] is true, \
  Reset button will reset form components to QuickFilterConfig state.<br> \
  Subscibing to the emitter will disable this functionality and consumer has to provide her own | &nbsp;
  (filtersChange) | EventEmitter<wbr>&lt;GenericObject&gt; | emits on quick filter bar change, \
  includes current value of all the form elements: \`\`\`{[key: string]: any}\`\`\` | &nbsp;
  &lt;b-form-element [id]="id"&gt; | ng-content | Any number of any form-elements. \
  They will be initialized according to QuickFilterConfig. \
  \`\`\`.key\`\`\` of QuickFilterConfig is matched to \`\`\`.id\`\`\` of the form component \
  Elemetns can be dynamically added. \`\`\`[id]\`\`\` property is mandatory. | &nbsp;
  &lt;b-button-element <br> bar-prefix&gt; | ng-content | Button to be displayed on the left of the bar \
  (consumer provides functionality) | &nbsp;
  &lt;b-button-element <br> bar-suffix&gt; | ng-content | Button to be displayed on the right of the bar \
  (consumer provides functionality) | &nbsp;

`;

const optionsFromList = (list, key = 'Stuff') => [
  {
    groupName: key,
    options: list.map(c => ({ value: c, id: simpleUID() })),
  },
];

const deselectOptions = options =>
  options.map(g => ({
    ...g,
    options: g.options.map(o => ({ ...o, selected: false })),
  }));

const items = optionsFromList(mockThings(), 'Things');

const animals = optionsFromList(mockAnimals(), 'Animals');

const quickFilters: QuickFilterConfig[] = [
  {
    key: 'name',
    label: 'Your name',
    placeholder: 'Enter your name',
    value: mockName(),
  },
  {
    key: 'social',
    label: 'Your social account',
    type: 'facebook',
  },
  {
    key: 'time',
    label: 'Time to get ill',
  },
  {
    key: 'hobbies',
    label: 'Your hobbies',
    placeholder: 'Pick from the list',
    options: optionsFromList(mockHobbies(), 'All hobbies'),
    showSingleGroupHeader: false,
  },
  {
    key: 'split',
    label: 'Pick items',
    inputType: InputTypes.number,
    selectOptions: animals,
    value: { inputValue: 23, selectValue: undefined },
  },
];

story.add(
  'Quick Filter Layout',
  () => {
    return {
      template: storyTemplate,
      props: {
        linkColor: LinkColor,
        datepickerType: DatepickerType,

        showResetFilter: boolean('showResetFilter', false, 'props'),
        quickFilters: object('quickFilters', quickFilters, 'props'),
        BSSoptions: object('BSSoptions', items, 'ignore'),
        BMSoptions: object('BMSoptions', animals, 'ignore'),
        filtersChange: action('Quick filter bar change'),
        resetFilters: action('Reset Filters click'),

        showName: boolean('showName (for demo)', true, 'props'),
        showHobbies: boolean('showHobbies (for demo)', true, 'props'),
        showSocial: boolean('showSocial (for demo)', true, 'props'),
        showTime: boolean('showTime (for demo)', false, 'props'),
        showSplitInpSel: boolean('showSplitInpSel (for demo)', false, 'props'),
        showLeftButt: boolean('showLeftButt (for demo)', true, 'props'),
        showRightButt: boolean('showRightButt (for demo)', true, 'props'),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          QuickFilterLayoutModule,
          MultiSelectModule,
          SingleSelectModule,
          DateRangePickerModule.init(BDateAdapterMock),
          AvatarModule,
          ButtonsModule,
          InputModule,
          SocialModule,
          TimePickerModule,
          SplitInputSingleSelectModule,
        ],
        entryComponents: [AvatarImageComponent],
      },
    };
  },
  { notes: { markdown: note } }
);
