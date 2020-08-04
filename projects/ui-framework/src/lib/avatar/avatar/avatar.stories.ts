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
import { ChipType } from '../../chips/chips.enum';
import { mockJobs, mockAvatar, mockName } from '../../mock.const';
import { Icons } from '../../icons/icons.enum';
import { ButtonsModule } from '../../buttons/buttons.module';

const story = storiesOf(ComponentGroupType.Avatar, module).addDecorator(
  withKnobs
);

const sizeOptionsKeys = Object.values(AvatarSize).filter(
  (key) => typeof key === 'string'
) as string[];
const sizeOptionsValues = Object.values(AvatarSize).filter(
  (key) => typeof key === 'number'
) as number[];
const sizeOptions = zipObject(sizeOptionsKeys, sizeOptionsValues);

const orientationOptions = Object.keys(AvatarOrientation);
const badges = [0, ...Object.keys(AvatarBadge)];
const chips = Object.values(ChipType).filter((o) => o !== ChipType.avatar);

const icons = [
  Icons.calendar,
  Icons.chat,
  Icons.doc_add,
  Icons.doc_icon,
  Icons.email,
  Icons.harmonise,
  Icons.home_main,
  Icons.home,
  Icons.infinite,
  Icons.lock,
  Icons.megaphone,
  Icons.note,
  Icons.department_icon,
  Icons.person,
  Icons.person_check,
  Icons.print,
  Icons.success,
  Icons.tag,
];

const template = `
<b-avatar
  [imageSource]="imageSource"
  [backgroundColor]="backgroundColor"
  [size]="size"
  [orientation]="orientation"
  [title]="title"
  [subtitle]="subtitle"
  [caption]="caption"
  [afterChipText]="afterChipText"
  [icon]="icon"
  [badge]="badge"
  [chip]="chipType && chipText ? {type: chipType, text: chipText} : undefined"
  [isClickable]="isClickable"
  [disabled]="disabled"
  [expectChanges]="true"
  (clicked)="clickHandler($event)">

  <b-text-button *ngIf="!(chipType && chipText)" avatar-text type="primary" text="View goals"></b-text-button>
</b-avatar>
`;

const template2 = `
  <b-avatar
    [avatar]="{
      imageSource:imageSource,
      backgroundColor:backgroundColor,
      size:size,
      orientation:orientation,
      title:title,
      subtitle:subtitle,
      caption:caption,
      afterChipText:afterChipText,
      icon:icon,
      badge:badge,
      chip: chipType && chipText ? {type: chipType, text: chipText} : undefined,
      isClickable:isClickable,
      disabled:disabled,
      expectChanges: true
    }">
      <b-text-button *ngIf="!(chipType && chipText)" avatar-text type="primary" text="View goals"></b-text-button>
  </b-avatar>
`;

const note = `
  ## Avatar Element
  #### Module
  *AvatarModule*

  ~~~
  <b-avatar
    [imageSource]="imageSource"
    [backgroundColor]="backgroundColor"
    [size]="size"
    [orientation]="orientation"
    [title]="title"
    [subtitle]="subtitle"
    [caption]="caption"
    [icon]="icon"
    [badge]="badge"
    [chip]="chip"
    [afterChipText]="afterChipText"
    [isClickable]="isClickable"
    [disabled]="disabled"
    (clicked)="clickHandler($event)">

    <b-text-button avatar-text type="primary" text="View goals"></b-text-button>
  </b-avatar>
  ~~~

  ~~~
  <b-avatar
    [avatar]="avatar"
    (clicked)="clickHandler($event)">
  </b-avatar>
  ~~~

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [avatar] | Avatar | all properties of Avatar interface can be assigned with single input | &nbsp;
  [imageSource] | string | URL of the avatar image<br>\
  **Important!** <br>\
  use **EmployeeAvatarService<wbr>.getOptimizedAvatarImage<wbr>(employee.about.avatar, AvatarSize)** <br>\
  to get correct avatar image | &nbsp;
  [backgroundColor] | string | background color | &nbsp;
  [size] | AvatarSize | enum for setting the avatar size | mini
  [orientation] | AvatarOrientation | vertical or horizontal | horizontal
  &nbsp; | &nbsp; | &nbsp; | &nbsp;
  [title] | string | main title of the avatar | &nbsp;
  [subtitle] | string | subtitle of the avatar | &nbsp;
  [caption] | string | caption & site | &nbsp;
  &nbsp; | &nbsp; | &nbsp; | &nbsp;
  [icon] | Icons / Icon | Icons enum or Icon {icon, color, size} object.\
  If just the Icons enum is provided, size & color is automatic.  | &nbsp;
  [badge] | AvatarBadge / BadgeConfig | AvatarBadge enum of approved, \
  pending or rejected / or BadgeConfig {icon, color} object  | &nbsp;
  [chip] | Chip | object describing the chip chip (should have type & text properties) | &nbsp;
  [afterChipText] | string | text to be placed to the right of the chip | &nbsp;
  &nbsp; | &nbsp; | &nbsp; | &nbsp;
  [disabled] | boolean | disabled state | false
  [isClickable] | boolean | flag for indicating if the avatar is clickable or not | false
  [tooltipType] | TruncateTooltipType | css or material | css
  [expectChanges] | boolean | set to true if texts are expected to change dynamically | false
  [supressWarnings] | boolean | suppress warnings about not using \
getOptimizedAvatarImage for imageSource (set to true if using images that are not avatars) | false
  &nbsp; | &nbsp; | &nbsp; | &nbsp;
  (clicked) | EventEmitter<wbr>&lt;MouseEvent&gt; | emitted on avatar click | &nbsp;
  &nbsp; | &nbsp; | &nbsp; | &nbsp;
  &lt;element&gt; | ng-content | you can pass stuff to be placed inside Avatar as ng-content | &nbsp;
  &lt;element avatar-text&gt; | ng-content | element with attribute \`[avatar-text]\` \
  will be displayed below texts | &nbsp;
`;

const storyTemplate = `
<b-story-book-layout [title]="'Avatar'">
    ${template2}
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
        title: text('title', mockName()),
        subtitle: text('subtitle', mockJobs(1)),
        caption: text('caption', 'Product, Israel'),
        afterChipText: text('afterChipText', '(Active)'),
        disabled: boolean('disabled', false),
        icon: select('icon', [0, ...icons]),
        badge: select('badge', badges, AvatarBadge.approved),
        backgroundColor: select('background color', ['#fff', 'red', 'black']),
        chipType: select('chip type', [0, ...chips], ChipType.success),
        chipText: text('chip text', 'Employed'),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          AvatarModule,
          ButtonsModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
