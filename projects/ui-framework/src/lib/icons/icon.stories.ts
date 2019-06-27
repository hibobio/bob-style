import { storiesOf } from '@storybook/angular';
import {
  boolean,
  select,
  text,
  withKnobs
} from '@storybook/addon-knobs/angular';
import { IconsModule } from './icons.module';
import { IconColor, Icons, IconSize } from './icons.enum';
import { reduce, values, keys } from 'lodash';
import { ComponentGroupType } from '../consts';
import { StoryBookLayoutModule } from '../story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const iconStories = storiesOf(ComponentGroupType.Icons, module).addDecorator(
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
        [icon]="icon"
        [size]="size"
        [color]="color"
        [hasHoverState]="hasHoverState">
</b-icon>
`;

const note = `
  ## Icon Element
  #### Module
  *IconsModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  toolTipSummary | String | Tooltip text  |
  icon | Icons | enum for the available icons |
  size | IconSize | enum for the available icon sizes |
  color | IconColor | enum for the available icon colors | dark (optional)
  hasHoverState | boolean | if icon has hover state | false

  ~~~
  ${template}
  ~~~
`;

const storyTemplate = `
<b-story-book-layout [title]="'Icon'">
  <div style="max-width: 400px; margin: 30px auto; display:flex; justify-content: center;">
    ${template}
  </div>
</b-story-book-layout>
`;

iconStories.add(
  'Icon element',
  () => {
    return {
      template: storyTemplate,
      props: {
        toolTipSummary: text('toolTipSummary', 'This is the icon element'),
        icon: select('icon', iconClasses, Icons.person),
        size: select('size', size, IconSize.large),
        color: select('color', color, IconColor.normal),
        hasHoverState: boolean('hasHoverState', true)
      },
      moduleMetadata: {
        imports: [BrowserAnimationsModule, IconsModule, StoryBookLayoutModule]
      }
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
        padding: 30px;
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
      <p style="margin: 0;">total icons: ${
        Array.from(new Set(iconClasses)).length
      }</p>
      <div class="icons-list">
        ${listHtml}
      </div>
</b-story-book-layout>
  `;
iconStories.add(
  'Icons list',
  () => {
    return {
      template: iconsListTemplate,
      props: {},
      moduleMetadata: {
        imports: [BrowserAnimationsModule, IconsModule, StoryBookLayoutModule]
      }
    };
  },
  { notes: { markdown: note } }
);
