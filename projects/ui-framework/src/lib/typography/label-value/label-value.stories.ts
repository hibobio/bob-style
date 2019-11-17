import { storiesOf } from '@storybook/angular';
import {
  text,
  withKnobs,
  select,
  boolean,
  number
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LabelValueType, TextAlign, IconPosition } from './label-value.enum';
import { randomNumber } from '../../services/utils/functional-utils';
import { mockText } from '../../mock.const';
import { Icons, IconSize } from '../../icons/icons.enum';
import { LabelValueModule } from './label-value.module';

const story = storiesOf(ComponentGroupType.Typography, module).addDecorator(
  withKnobs
);

const template = `
  <b-label-value
        [type]="type"
        [textAlign]="textAlign"
        [label]="label"
        [value]="value"
        [labelMaxLines]="labelMaxLines"
        [valueMaxLines]="valueMaxLines"
        [expectChanges]="true"
        [icon]="icon"
        [iconPosition]="iconPosition"
        [iconSize]="iconSize"></b-label-value>
`;

const template3 = `
  <b-label-value
        [type]="type"
        [textAlign]="textAlign"
        [label]="label"
        [value]="value"
        [labelMaxLines]="labelMaxLines"
        [valueMaxLines]="valueMaxLines"
        [icon]="icon"
        [iconPosition]="iconPosition"
        [iconSize]="iconSize"
        (clicked)="OnClick($event)"
        (labelClicked)="OnLabelClick($event)"
        (valueClicked)="OnValueClick($event)"></b-label-value>
`;

const template2 = `
  <style>
    .cont {
      border-top: 1px solid #535353;
      margin-top: 50px;
      text-align: left;
    }
    @media (min-width: 450px) {
      .cont {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
      }
    }
    .cell {
      margin-top: 40px;
    }
    @media (min-width: 450px) {
      .cell {
        width: 48%;
      }
    }
    @media (min-width: 800px) {
      .cell {
        width: 31%;
      }
    }
    .hdr {
      margin: 0 0 10px 0;
    }
    .bx {
      display: inline-block;
      font-size: 11px;
      font-weight: 600;
      padding: 3px 5px;
      background-color: #e2e2e2;
    }
  </style>

  <div class="cont">

    <div class="cell">
      <p class="hdr">
        <span class="bx">LabelValueType.one</span>
      </p>
      <b-label-value
        [type]="'1'"
        [label]="'01/06/2019'"
        [value]="'Holiday'"></b-label-value>
    </div>

    <div class="cell">
      <p class="hdr">
        <span class="bx">LabelValueType.two, value clickable</span>
      </p>
      <b-label-value
        [type]="'2'"
        [label]="'Reason'"
        [value]="'Im planning a trip to celebrate my birthday.'"
        (valueClicked)="onValueClicked($event)"></b-label-value>
    </div>

    <div class="cell">
      <p class="hdr">
        <span class="bx">LabelValueType.three, label clickable</span>
      </p>
      <b-label-value
        [type]="'3'"
        [label]="'Alan Tulins'"
        [value]="'Product designer'"
        (labelClicked)="onLabelClicked($event)"></b-label-value>
    </div>

    <div class="cell">
      <p class="hdr">
        <span class="bx">LabelValueType.four, clickable</span>
      </p>
      <b-label-value
        [type]="'4'"
        [label]="'Current balance'"
        [value]="'4.25'" (clicked)="onClicked($event)"></b-label-value>
    </div>

    <div class="cell">
      <p class="hdr">
        <span class="bx">LabelValueType.five</span>
      </p>
      <b-label-value
        [type]="'5'"
        [label]="'Elsie Hunter'"
        [value]="'11/03/2019'"></b-label-value>
    </div>

    <div class="cell">
      <p class="hdr">
        <span class="bx">LabelValueType.six</span>
      </p>
      <b-label-value
        [type]="'6'"
        [label]="'Talent Group'"
        [value]="'Date created: 11/03/2019'"></b-label-value>
    </div>

    <div class="cell">
      <p class="hdr">
        <span class="bx">LabelValueType.seven</span>
      </p>
      <b-label-value
        [type]="'7'"
        [label]="'Approved on'"
        [value]="'12/12/2019'"></b-label-value>
    </div>

    <div class="cell">
      <p class="hdr">
        <span class="bx">icon example 1, icon clickable</span>
      </p>
      <b-label-value
        [type]="'1'"
        [label]="'Restore'"
        [value]="'Click icon to restore'"
        [icon]="'b-icon-restore'"
        (iconClicked)="onIconClicked($event)"></b-label-value>
    </div>

    <div class="cell">
      <p class="hdr">
        <span class="bx">icon example 2, value clickable</span>
      </p>
      <b-label-value
        [type]="'1'"
        [label]="'Call me'"
        [value]="'555 55 55'"
        [icon]="'b-icon-phone-alt'"
        [iconPosition]="'label'"
        (valueClicked)="onValueClicked($event)"></b-label-value>
    </div>

    <div class="cell">
      <p class="hdr">
        <span class="bx">icon example 3, clickable</span>
      </p>
      <b-label-value
        [type]="'4'"
        [label]="'Deserves a quiet night'"
        [value]="'Nightswimming'"
        [icon]="'b-icon-timeoff'"
        [iconPosition]="'top'"
        [iconSize]="'x-large'"
        [textAlign]="'center'"
        (clicked)="onClicked($event)"></b-label-value>
    </div>

  </div>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Label-Value'" style="background-color: rgb(247,247,247);">
    <div style="max-width: 1050px;">
      <div style="display: inline-block; margin: 0 auto; max-width: 100%;">${template}</div>
      ${template2}
    </div>
</b-story-book-layout>
`;

const note = `
  ## Label-Value

  #### Module
  *TypographyModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [type] | LabelValueType | type/theme | LabelValueType.one
  [label] | string | label/title text | &nbsp;
  [value] | string | value text | &nbsp;
  [labelMaxLines] | number | after maximum lines text will be truncated and tooltip shown | &nbsp;
  [valueMaxLines] | number | after maximum lines text will be truncated and tooltip shown | &nbsp;
  [icon] | Icons | icon, obviously | &nbsp;
  [iconPosition] | IconPosition | top, left, right, and also 'label' and 'value' which allow to put the icon inside label or value | left
  [iconSize] | IconSize | icon size | large (small if positioned inside label or value)
  (clicked) | EventEmitter | emits when component is clicked
  (labelClicked) | EventEmitter | emits when label is clicked
  (valueClicked) | EventEmitter | emits when value is clicked
  (iconClicked) | EventEmitter | emits when icon is clicked

  ~~~
  ${template3}
  ~~~
`;

story.add(
  'Label-Value',
  () => {
    return {
      template: storyTemplate,
      props: {
        onClicked: action('Component clicked'),
        onLabelClicked: action('Label clicked'),
        onValueClicked: action('Value clicked'),
        onIconClicked: action('Icon clicked'),

        type: select('type', Object.values(LabelValueType), LabelValueType.one),
        label: text('label', mockText(randomNumber(1, 3))),
        value: text('value', mockText(randomNumber(4, 6))),

        textAlign: select(
          'textAlign',
          Object.values(TextAlign),
          TextAlign.left
        ),
        labelMaxLines: number('labelMaxLines', 0),
        valueMaxLines: number('valueMaxLines', 0),

        icon: select('icon', [0, ...Object.values(Icons)], 0),
        iconPosition: select(
          'iconPosition',
          Object.values(IconPosition),
          IconPosition.left
        ),
        iconSize: select('iconSize', [0, ...Object.values(IconSize)], 0)
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          LabelValueModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
