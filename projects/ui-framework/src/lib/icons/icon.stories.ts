import { storiesOf } from '@storybook/angular';
import {
  boolean,
  select,
  text,
  withKnobs,
} from '@storybook/addon-knobs/angular';
import { IconsModule } from './icons.module';
import { IconColor, Icons, IconSize, IconType } from './icons.enum';
import { reduce, values } from 'lodash';
import { ComponentGroupType } from '../consts';
import { StoryBookLayoutModule } from '../story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const story = storiesOf(ComponentGroupType.Icons, module).addDecorator(
  withKnobs
);

const iconClasses = Object.values(Icons).sort();

let iconKeys = iconClasses.reduce((acc, ic) => {
  const allKeys = Object.keys(Icons).filter(key => Icons[key] === ic);
  allKeys.forEach(key => {
    acc.push(key);
  });

  return acc;
}, []);
iconKeys = Array.from(new Set(iconKeys));

const size = values(IconSize);
const color = values(IconColor);

const template = `

<b-icon [toolTipSummary]="toolTipSummary"
        [type]="type"
        [icon]="icon"
        [size]="size"
        [color]="color"
        [hasHoverState]="hasHoverState"
        [rotate]="rotate">
</b-icon>
`;

const note = `
  ## Icon Element
  #### Module
  *IconsModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [type] | IconType | regular or circular | regular
  [icon] | Icons | enum for the available icons | &nbsp;
  [size] | IconSize | enum for the available icon sizes | &nbsp;
  [color] | IconColor | enum for the available icon colors | dark
  [toolTipSummary] | String | Tooltip text (uses simple CSS tooltip. if it looks bad, use matTooltip instead)  | &nbsp;
  [hasHoverState] | boolean | if icon has hover state | false
  [rotate] | '90', '-90', '180' | icon transform/rotate | &nbsp;

  ~~~
  ${template}
  ~~~
`;

const storyTemplate = `
<b-story-book-layout [title]="'Icon'">
    ${template}
</b-story-book-layout>
`;

story.add(
  'Icon element',
  () => {
    return {
      template: storyTemplate,
      props: {
        type: select('type', Object.values(IconType), IconType.regular),
        icon: select('icon', iconClasses, Icons.person),
        size: select('size', size, IconSize.large),
        color: select('color', color, IconColor.normal),
        hasHoverState: boolean('hasHoverState', true),
        toolTipSummary: text('toolTipSummary', 'This is the icon element'),
        rotate: select('rotate', ['0', '90', '180', '-90'], '0'),
      },
      moduleMetadata: {
        imports: [BrowserAnimationsModule, IconsModule, StoryBookLayoutModule],
      },
    };
  },
  { notes: { markdown: note } }
);

const listHtml = reduce(
  iconKeys,
  (iconsTemplate, icon) => {
    return (
      iconsTemplate +
      `<div class="icon-wrapper">
      <b-icon icon=${Icons[icon]} size="large"></b-icon>
      <div class="icon-title">
        <strong>enum:</strong> ${icon}<br>
        <strong>class:</strong> ${Icons[icon]}
      </div>
    </div>`
    );
  },
  ''
);
const iconsListTemplate = `
<b-story-book-layout [title]="'Icon list'">
    <style>
      .icons-list {
        max-width: 100%;

        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
      }
      .icon-wrapper {
        width: calc(25% - 5px);
        margin-bottom: 5px;
        background-color: #F8F7F7;
        border: 1px solid #535353;
        padding: 20px;
        border-radius: 4px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      b-icon {
        display: block;
      }
      .icon-title {
        padding-top: 12px;
        max-width: 100%;
        overflow-wrap: break-word;
      }
    </style>
      <p style="width:100%; margin: 0 0 10px;">total icons: ${
        Array.from(new Set(iconClasses)).length
      }</p>
      <div class="icons-list" style="max-width:none;">
        ${listHtml}
      </div>
</b-story-book-layout>
  `;
story.add(
  'Icons list',
  () => {
    return {
      template: iconsListTemplate,
      props: {},
      moduleMetadata: {
        imports: [BrowserAnimationsModule, IconsModule, StoryBookLayoutModule],
      },
    };
  },
  { notes: { markdown: note } }
);
