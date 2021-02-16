import { storiesOf } from '@storybook/angular';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { zipObject } from 'lodash';
import { AvatarSize, AvatarBadge } from '../avatar.enum';
import { ComponentGroupType } from '../../../consts';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
import { AvatarModule } from '../avatar.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsModule } from '../../../icons/icons.module';
import { Icons } from '../../../icons/icons.enum';
import { mockAvatar } from '../../../mock.const';

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
<b-avatar-image
    [size]="size"
    [imageSource]="imageSource"
    [backgroundColor]="backgroundColor"
    [icon]="icon"
    [badge]="badge"
    [text]="text"
    [disabled]="disabled"
    (clicked)="onClick($event)">
</b-avatar-image>
`;

const template2 = `
<b-avatar-image
    [avatar]="{
      size:size,
      imageSource:imageSource,
      backgroundColor:backgroundColor,
      icon:icon,
      badge:badge,
      text:text,
      disabled:disabled,
      border: border
    }"
    (clicked)="onClick($event)">
</b-avatar-image>
`;

const note = `
  ## Avatar Image Element
  #### Module
  *AvatarModule*

  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [imageSource] | string | URL of the avatar image<br>\
  **Important!** <br>\
  use **EmployeeAvatarService<wbr>.getOptimizedAvatarImage<wbr>\
  (employee.about.avatar, AvatarSize)** <br>\
  to get correct avatar image | &nbsp;
  [backgroundColor] | string | background color | grey-200
  [size] | AvatarSize | enum for setting the avatar size | mini
  [icon] | Icons / Icon | Icons enum or Icon {icon, color, size} object.\
  If just the Icons enum is provided, size & color is automatic.  | &nbsp;
  [badge] | AvatarBadge / Icon | AvatarBadge enum of approved, \
  pending or rejected / or Icon {icon, color} object  | &nbsp;
  [text] | string | text to put inside (will disable icon) | &nbsp;
  [disabled] | boolean | disabled state | false
  [supressWarnings] | boolean | suppress warnings about not using \
  getOptimizedAvatarImage for imageSource (set to true if using images that are not avatars) | false
  (clicked) | EventEmitter<wbr>&lt;MouseEvent&gt; | emitted on avatar click | &nbsp;
  ng-content | element | you can pass stuff to be placed inside Avatar as ng-content | &nbsp;

  ~~~
  ${template2}
  ~~~
`;

const storyTemplate = `
<b-story-book-layout [title]="'Avatar Image'" style="background: rgb(245,245,245);">
    ${template2}
</b-story-book-layout>
`;

story.add(
  'Avatar Image',
  () => {
    return {
      template: storyTemplate,
      props: {
        imageSource: text('imageSource', mockAvatar()),
        size: select('size', sizeOptions, AvatarSize.large),
        backgroundColor: select(
          'background color',
          [0, '#fff', 'red', 'black'],
          null
        ),
        icon: select('icon', [0, ...icons], null),
        badge: select(
          'badge',
          [0, ...Object.keys(AvatarBadge)],
          AvatarBadge.approved
        ),
        text: text('text', null),
        disabled: boolean('disabled', false),
        onClick: action('Avatar Clicked'),
        border: boolean('border', false),
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
