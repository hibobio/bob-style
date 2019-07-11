import { storiesOf } from '@storybook/angular';
import {
  boolean,
  select,
  text,
  withKnobs
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { zipObject } from 'lodash';
import { AvatarSize, AvatarBadge, AvatarOrientation } from './avatar.enum';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { AvatarModule } from './avatar.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsModule } from '../../icons/icons.module';
import { ChipType } from '../../chips/chips.enum';
import { mockNames, mockJobs, mockAvatar } from '../../mock.const';
import { UtilComponentsModule } from '../../services/util-components/utilComponents.module';

const avatarStories = storiesOf(
  `${ComponentGroupType.ButtonsAndIndicators}.Avatar`,
  module
).addDecorator(withKnobs);

const sizeOptionsKeys = Object.values(AvatarSize).filter(
  key => typeof key === 'string'
) as string[];
const sizeOptionsValues = Object.values(AvatarSize).filter(
  key => typeof key === 'number'
) as number[];
const sizeOptions = zipObject(sizeOptionsKeys, sizeOptionsValues);

const orientationOptions = Object.keys(AvatarOrientation);
const badges = Object.keys(AvatarBadge);
const chips = Object.values(ChipType).filter(o => o !== ChipType.avatar);

const template = `
<b-avatar
  [imageSource]="imageSource"
  [backgroundColor]="backgroundColor"
  [size]="size"
  [orientation]="orientation"
  [title]="title"
  [subtitle]="subtitle"
  [caption]="caption"
  [badge]="badge"
  [chip]="chip"
  [isClickable]="isClickable"
  [disabled]="disabled"
  (clicked)="clickHandler($event)"
  >
</b-avatar>
`;

const note = `
  ## Avatar Element
  #### Module
  *AvatarModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  imageSource | string | URL of the avatar image | none
  backgroundColor | string | background color | none
  size | AvatarSize | enum for setting the avatar size | mini
  orientation | AvatarOrientation | vertical or horizontal | horizontal
  title | string | main title of the avatar | none
  subtitle | string | subtitle of the avatar | none
  caption | string | caption & site | none
  badge | AvatarBadge / BadgeConfig | AvatarBadge enum of approved, pending or rejected / or BadgeConfig {icon, color} object  | none
  chip | Chip | object describing the chip chip (should have type & text properties) | none
  disabled | boolean | disabled avatar | false
  isClickable | boolean | flag for indicating if the avatar is clickable or not | false
  clicked | Function | callback for clicking on the avatar | none

  ~~~
  ${template}
  ~~~
`;

const storyTemplate = `
<b-story-book-layout [title]="'Avatar'">
  <div style="display: flex; justify-content: center; padding: 30px;">
    ${template}
  </div>
  <b-stats></b-stats>
</b-story-book-layout>
`;

avatarStories.add(
  'Avatar',
  () => {
    return {
      template: storyTemplate,
      props: {
        imageSource: text('imageSource', mockAvatar()),
        size: select('size', sizeOptions, AvatarSize.large),
        orientation: select(
          'orientation',
          orientationOptions,
          AvatarOrientation.horizontal
        ),
        isClickable: boolean('isClickable', false),
        clickHandler: action('Avatar Clicked'),
        title: text('title', mockNames(1)),
        subtitle: text('subtitle', mockJobs(1)),
        caption: text('caption', 'Product, Israel'),
        disabled: boolean('disabled', false),
        badge: select('badge', badges, AvatarBadge.approved),
        backgroundColor: select('background color', ['#fff', 'red', 'black']),
        chip: {
          type: select('chip type', chips, ChipType.success),
          text: text('chip text', 'Employed')
        }
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          AvatarModule,
          IconsModule,
          UtilComponentsModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
