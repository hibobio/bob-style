import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import {
  number,
  object,
  select,
  text,
  withKnobs,
} from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType } from '../../consts';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { LinkColor, LinkTarget } from '../../indicators/link/link.enum';
import { mockText } from '../../mock.const';
import { randomNumber } from '../../services/utils/functional-utils';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { IconPosition, LabelValueType, TextAlign } from './label-value.enum';
import { LabelValueModule } from './label-value.module';

const story = storiesOf(ComponentGroupType.Typography, module).addDecorator(
  withKnobs
);

const templateAlt = `
  <p class="mrg-0"
    [labelValue]="{
      type:type,
      textAlign:textAlign,
      label:label,
      labelDescription:labelDescription,
      value:value,
      labelMaxLines:labelMaxLines,
      valueMaxLines:valueMaxLines,
      expectChanges: true,
      icon:icon,
      iconPosition:iconPosition,
      iconSize:iconSize,
      iconColor:iconColor
    }"></p>
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
        (clicked)="OnClick($event)">

        <span label>(value content)</span>
        <span value>(label content)</span>
        <span>(also content)</span>

  </b-label-value>
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
        [labelValue]="{valueClicked:onValueClicked($event)}"
        [type]="'2'"
        [label]="'Reason'"
        [value]="'Im planning a trip to celebrate my birthday.'"></b-label-value>
    </div>

    <div class="cell">
      <p class="hdr">
        <span class="bx">LabelValueType.three, label clickable</span>
      </p>
      <b-label-value
        [labelValue]="{labelClicked:onLabelClicked($event)}"
        [type]="'3'"
        [label]="'Alan Tulins'"
        [value]="'Product designer'"></b-label-value>
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
        <span class="bx">LabelValueType.eight</span>
      </p>
      <b-label-value
        [type]="'8'"
        [label]="'40'"
        [icon]="'b-icon-people'"
        [iconSize]="'x-large'"
        [value]="'Employees'"></b-label-value>
    </div>

    <div class="cell">
      <p class="hdr">
        <span class="bx">LabelValueType.nine</span>
      </p>
      <b-label-value
        [type]="'9'"
        [label]="'Form section title'"
        [value]="longtext"></b-label-value>
    </div>

    <div class="cell">
      <p class="hdr">
        <span class="bx">icon example 1, icon clickable</span>
      </p>
      <b-label-value
        [labelValue]="{iconClicked:onIconClicked($event)}"
        [type]="'1'"
        [label]="'Restore'"
        [value]="'Click icon to restore'"
        [icon]="'b-icon-restore'"></b-label-value>
    </div>

    <div class="cell">
      <p class="hdr">
        <span class="bx">icon example 2, value clickable</span>
      </p>
      <b-label-value
        [labelValue]="{valueClicked:onValueClicked($event)}"
        [type]="'1'"
        [label]="'Call me'"
        [value]="'555 55 55'"
        [icon]="'b-icon-phone-alt'"
        [iconPosition]="'label'"></b-label-value>
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
      <div style="display: inline-block; margin: 0 auto; max-width: 100%;">${templateAlt}</div>
      ${template2}
    </div>
</b-story-book-layout>
`;

const note = `
  ## Label-Value

  #### Module
  *LabelValueModule*

  ~~~
  <b-label-value [labelValue]="labelValue">
  </b-label-value>

  <p class="mrg-0"
      [labelValue]="{
        ...labelValueConfig,
        labelClass: ['mrg-b-24'],
        valueStyle: { fontWeight: '700' }
      }"
      [iconColor]="iconColor"
      [style.--blv-label-color]="customLcolor"
      [style.--blv-value-color]="customVcolor">
  </p>
  ~~~

  #### Note:
  • You can combine [labelValue] for static config and separate inputs for dynamic properties.<br>
  • For quick customization beyound provided types, use <em>labelClass, labelStyle, valueClass, valueStyle</em> properties on [labelValue] and/or add css variables for label and value colors.

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [labelValue] | LabelValue | all properties of LabelValue interface can be assigned with single input | &nbsp;
  [type] | LabelValueType | type/theme | LabelValueType.one
  [label] | string | label/title text | &nbsp;
  [value] | string | value text | &nbsp;
  [labelMaxLines] | number | after maximum lines text will be truncated and tooltip shown | &nbsp;
  [valueMaxLines] | number | after maximum lines text will be truncated and tooltip shown | &nbsp;
  [icon] | Icons | icon, obviously | &nbsp;
  [iconPosition] | IconPosition | top, left, right, \
  and also 'label', 'value', 'label_after', 'value_after' \
  which allow to put the icon inside label or value | left
  [iconSize] | IconSize | icon size | large (small if positioned inside label or value)
  [iconColor] | IconColor | icon color | null
  [labelDescription], [valueDescription] | InfoTooltip |  &lt;b-info-tooltip&gt; component config | undefined
  (clicked) | EventEmitter | emits when component is clicked | &nbsp;

  #### additional properties on LabelValue interface
  Name | Type | Description | Default value
  --- | --- | --- | ---
  labelClass, valueClass | string / string[] / object | custom classes - support what ngClass binding supports | &nbsp;
  labelStyle, valueStyle | object | custom css styles - support what ngStyle supports | &nbsp;
  tooltipType | TruncateTooltipType | for built-in truncate-tooltip component | 'css'
  labelClicked | function | handler for label click | &nbsp;
  valueClicked | EventEmitter | handler for value click | &nbsp;
  iconClicked | EventEmitter | handler for icon click | &nbsp;

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
        longtext: `Some description of form section. Can be quite long. And possibly  not related to the form section at all.\nCan have line-breaks via '\\n' character!`,
        onClicked: action('Component clicked'),
        onLabelClicked: ($event) => action('Label clicked'),
        onValueClicked: ($event) => action('Value clicked'),
        onIconClicked: ($event) => action('Icon clicked'),

        type: select('type', Object.values(LabelValueType), LabelValueType.one),
        label: text('label', mockText(randomNumber(1, 3))),
        value: text('value', mockText(randomNumber(4, 6))),
        labelDescription: object('labelDescription', {
          title: mockText(3),
          text: mockText(7),
          iconSize: IconSize.small,
          icon: Icons.info_outline,
          linkClicked: () => {
            console.log('LINK WAS CLICKED');
          },
          link: {
            text: mockText(2),
            color: LinkColor.primary,
            target: LinkTarget.blank,
          },
        }),

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
        iconSize: select('iconSize', [0, ...Object.values(IconSize)], 0),
        iconColor: select('iconColor', IconColor, IconColor.dark),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          LabelValueModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
