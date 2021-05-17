import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType } from '../consts';
import { ColorPalette } from '../services/color-service/color-palette.enum';
import { randomFromArray } from '../services/utils/functional-utils';
import { StoryBookLayoutModule } from '../story-book-layout/story-book-layout.module';
import { IconColor, Icons, IconSize, IconType } from './icons.enum';
import { IconsModule } from './icons.module';

const story = storiesOf(ComponentGroupType.Icons, module).addDecorator(
  withKnobs
);

const iconClasses = Object.values(Icons).sort();

let iconKeys = iconClasses.reduce((acc, ic) => {
  const allKeys = Object.keys(Icons).filter((key) => Icons[key] === ic);
  allKeys.forEach((key) => {
    acc.push(key);
  });

  return acc;
}, []);
iconKeys = Array.from(new Set(iconKeys));

const template = `<b-icon [config]="{
                      icon: icon,
                      type: type,
                      size: size,
                      color: color,
                      hasHoverState: hasHoverState,
                      toolTipSummary: toolTipSummary,
                      rotate: rotate
                    }">
</b-icon>`;

const templForNotes = `<b-icon [type]="type"
        [icon]="icon"
        [size]="size"
        [color]="color"
        [hasHoverState]="true">
</b-icon>`;

const note = `
  ## Icon Element
  #### Module
  *IconsModule*

  ~~~
  <b-icon [config]="iconConfig"></b-icon>

  ${templForNotes}
  ~~~

  <mark>**Note**: Use [config] input for static props and separate inputs for dynamic props</mark>

  #### Properties (interface Icon)
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [config] | <u>Icon</u> | all properties can be supplied as one config object | &nbsp;
  [type] | IconType | regular or circular | regular
  [icon] | Icons | enum for the available icons | &nbsp;
  [size] | IconSize/number | icon size preset/enum, or custom size in px | medium
  [color] | IconColor/<wbr>ColorPalette/<wbr>string | icon color preset/enum, or string with custom color | dark
  [toolTipSummary] | String | Tooltip text (uses simple CSS tooltip. if it looks bad, use matTooltip instead)  | &nbsp;
  [hasHoverState] | boolean | if icon has hover state | false
  [rotate] | '90', '-90', '180' | icon transform/rotate | &nbsp;
`;

const storyTemplate = `
<b-story-book-layout [title]="'Icon'">
    ${template}
</b-story-book-layout>
`;

const colors = Object.values(IconColor).concat(
  randomFromArray(Object.values(ColorPalette), 5) as any
);

story.add(
  'Icon element',
  () => {
    return {
      template: storyTemplate,
      props: {
        type: select('type', Object.values(IconType), IconType.regular),
        icon: select('icon', iconClasses, Icons.person),
        size: select('size', [...Object.values(IconSize), 30], IconSize.large),
        color: select('color', colors, IconColor.normal),
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

const listHtml = iconKeys.reduce((iconsTemplate, icon) => {
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
}, '');

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
