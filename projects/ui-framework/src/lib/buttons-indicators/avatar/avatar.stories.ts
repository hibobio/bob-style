import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { text, select, boolean, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { AvatarComponent } from './avatar.component';
import { values } from 'lodash';
import { AvatarSize } from './avatar.enum';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

const avatarStories = storiesOf(ComponentGroupType.ButtonsAndIndicators, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const sizeOptions = values(AvatarSize);
const template = `
<b-story-book-layout title="Avatar">
  <b-avatar
    [imageSource]="imageSource"
    [size]="size"
    [isClickable]="isClickable"
    (clicked)="clickHandler($event)">
  </b-avatar>
</b-story-book-layout>
`;
const note = `
  ## Avatar Element

  #### Properties

  Name | Type | Description | Default value
  --- | --- | --- | ---
  imageSource | String | url of the image |
  size | AvatarSize | enum for setting the avatar size | mini (optional)
  clicked | Boolean | boolean flag for indicating if the avatar is clickable or not | false (optional)
  handleClick | Function | callback for clicking on the avatar | no click (optional)

  ~~~
  ${ template }
  ~~~
`;
avatarStories.add(
  'Avatar',
  () => {
    return {
      template,
      props: {
        imageSource: text('imageSource', 'https://pixel.nymag.com/imgs/daily/vulture/2017/03/23/23-han-solo.w330.h330.jpg'),
        size: select('size', sizeOptions, AvatarSize.medium),
        isClickable: boolean('isClickable', false),
        clickHandler: action()
      },
      moduleMetadata: {
        declarations: [AvatarComponent],
        imports: [
          StoryBookLayoutModule,
        ],
      }
    };
  },
  { notes: { markdown: note } }
);

