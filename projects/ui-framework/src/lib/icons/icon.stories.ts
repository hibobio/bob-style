import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { text, select, withKnobs } from '@storybook/addon-knobs/angular';
import { IconsModule } from './icons.module';
import { Icons, IconSize, IconColor } from './icons.enum';
import { values, reduce } from 'lodash';
import { ComponentGroupType } from '../consts';
import { StoryBookLayoutModule } from '../story-book-layout/story-book-layout.module';

const iconStories = storiesOf(ComponentGroupType.Icons, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const icons = values(Icons);
const size = values(IconSize);
const color = values(IconColor);

const template = `
<b-story-book-layout title="Icon">
  <b-icon
    [toolTipSummary]="toolTipSummary"
    [icon]="icon"
    [size]="size"
    [color]="color">
  </b-icon>
</b-story-book-layout>
`;
const displayTemplate = `${ template }`;
const note = `
  ## Icon Element

  #### Properties

  Name | Type | Description | Default value
  --- | --- | --- | ---
  toolTipSummary | String | Tooltip text  |
  icon | Icons | enum for the available icons |
  size | IconSize | enum for the available icon sizes |
  color | IconColor | enum for the available icon colors | dark (optional)

  ~~~
  ${ template }
  ~~~
`;
iconStories.add(
  'Icon element',
  () => {
    return {
      template: displayTemplate,
      props: {
        toolTipSummary: text('toolTipSummary', 'This is the icon element'),
        icon: select('icon', icons, Icons.docs_link),
        size: select('size', size, IconSize.large),
        color: select('color', color, IconColor.dark),
      },
      moduleMetadata: {
        imports: [
          IconsModule,
          StoryBookLayoutModule,
        ]
      }
    };
  },
  { notes: { markdown: note } }
);

const listHtml = reduce(icons, (iconsTemplate, icon) => {
  return iconsTemplate + `<div class="icon-wrapper">
      <b-icon icon=${ icon } size="large"></b-icon><div class="icon-title">${ icon }</div>
    </div>`;
}, '');
const iconsListTemplate = `
<b-story-book-layout title="Icon list">
    <style>
      .icons-list {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 10px;
      }
      b-icon { text-align: center; }
      .icon-title { text-align: center; padding-top:12px; }
      .icon-wrapper { background-color: #F8F7F7; border: 1px solid #535353; padding: 20px; border-radius: 4px; }
    </style>
    <div class="icons-list">
      ${ listHtml }
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
        imports: [
          IconsModule,
          StoryBookLayoutModule,
        ]
      }
    };
  },
  { notes: { markdown: note } }
);

