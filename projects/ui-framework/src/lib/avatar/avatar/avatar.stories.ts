import { storiesOf } from '@storybook/angular';
import {
  boolean,
  select,
  text,
  withKnobs,
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

const story = storiesOf(ComponentGroupType.Avatar, module).addDecorator(
  withKnobs
);

const sizeOptionsKeys = Object.values(AvatarSize).filter(
  key => typeof key === 'string'
) as string[];
const sizeOptionsValues = Object.values(AvatarSize).filter(
  key => typeof key === 'number'
) as number[];
const sizeOptions = zipObject(sizeOptionsKeys, sizeOptionsValues);

const orientationOptions = Object.keys(AvatarOrientation);
const badges = [0, ...Object.keys(AvatarBadge)];
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
  [expectChanges]="true"
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
  [imageSource] | string | URL of the avatar image | &nbsp;
  [backgroundColor] | string | background color | &nbsp;
  [size] | AvatarSize | enum for setting the avatar size | mini
  [orientation] | AvatarOrientation | vertical or horizontal | horizontal
  [title] | string | main title of the avatar | &nbsp;
  [subtitle] | string | subtitle of the avatar | &nbsp;
  [caption] | string | caption & site | &nbsp;
  [badge] | AvatarBadge / BadgeConfig | AvatarBadge enum of approved, \
  pending or rejected / or BadgeConfig {icon, color} object  | &nbsp;
  [chip] | Chip | object describing the chip chip (should have type & text properties) | &nbsp;
  [disabled] | boolean | disabled avatar | false
  [isClickable] | boolean | flag for indicating if the avatar is clickable or not | false
  (clicked) | EventEmitter<wbr>&lt;MouseEvent&gt; | emitted on avatar click | &nbsp;

  ~~~
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
    (clicked)="clickHandler($event)">
  </b-avatar>
  ~~~
`;

const storyTemplate = `
<b-story-book-layout [title]="'Avatar'">
    ${template}
</b-story-book-layout>
`;

story.add(
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
          text: text('chip text', 'Employed'),
        },
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          AvatarModule,
          IconsModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
