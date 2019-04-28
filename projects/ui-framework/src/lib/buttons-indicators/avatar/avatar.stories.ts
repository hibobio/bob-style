import { storiesOf } from '@storybook/angular';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { values } from 'lodash';
import { AvatarSize } from './avatar.enum';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { AvatarModule } from './avatar.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const avatarStories = storiesOf(ComponentGroupType.ButtonsAndIndicators, module).addDecorator(
  withKnobs
);

const sizeOptions = values(AvatarSize);
const template = `
<div style="display: flex; justify-content: center;">
<b-avatar
  [imageSource]="imageSource"
  [size]="size"
  [isClickable]="isClickable"
  [title]="title"
  [subtitle]="subtitle"
  [disabled]="disabled"
  (clicked)="clickHandler($event)">
</b-avatar>
</div>
`;
const note = `
  ## Avatar Element
  #### Module
  *AvatarModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  imageSource | String | url of the image |
  size | AvatarSize | enum for setting the avatar size | mini (optional)
  isClickable | boolean | can click avatar | false
  title | string | main title of the avatar | '' (optional)
  subtitle | string | subtitle of the avatar | '' (optional)
  disabled | boolean | disabled avatar | false (optional)
  clicked | boolean | boolean flag for indicating if the avatar is clickable or not | false (optional)
  handleClick | Function | callback for clicking on the avatar | no click (optional)

  ~~~
  ${template}
  ~~~
`;

const storyTemplate = `
<b-story-book-layout [title]="'Avatar'">
  ${template}
</b-story-book-layout>
`;

avatarStories.add(
  'Avatar',
  () => {
    return {
      template: storyTemplate,
      props: {
        imageSource: text(
          'imageSource',
          'https://pixel.nymag.com/imgs/daily/vulture/2017/03/23/23-han-solo.w330.h330.jpg'
        ),
        size: select('size', sizeOptions, AvatarSize.medium),
        isClickable: boolean('isClickable', false),
        clickHandler: action(),
        title: text('title', 'John Doe'),
        subtitle: text('subtitle', 'Web Developer'),
        disabled: boolean('disabled', false),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          AvatarModule,
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
