import { storiesOf } from '@storybook/angular';
import { object, text, number, withKnobs } from '@storybook/addon-knobs';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { mockAvatar } from '../../mock.const';
import { EyeCandyModule } from '../eye-candy.module';
import { boolean } from '@storybook/addon-knobs';
import {
  AVATAR_LOCATIONS_DEF_DESK,
  AVATAR_LOCATIONS_DEF_MOB,
} from './floating-avatars.const';

const story = storiesOf(ComponentGroupType.EyeCandy, module).addDecorator(
  withKnobs
);

const avatarNum = 15;
const avatarImagesMock: string[] = Array.from(Array(avatarNum), (_, i) => {
  return mockAvatar();
});
const centerAvatarImageMock = mockAvatar();

const template = `
  <b-floating-avatars [avatarImages]="avatarImages"
                      [centerAvatarImage]="centerAvatarImage"
                      [centerAvatarSize]="centerAvatarSize"
                      [animationSpeed]="animationSpeed"
                      [animateLines]="animateLines"
                      [animateShadows]="animateShadows"
                      [animateOnDesktop]="animateOnDesktop"
                      [animateOnMobile]="animateOnMobile"
                      [avatarsLocationsDesktop]="avatarsLocationsDesktop"
                      [avatarLocationsMobile]="avatarLocationsMobile">
  </b-floating-avatars>
`;

const note = `
  ## Floating avatars

  #### Module
  *EyeCandyModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [avatarImages] | string[] | Array of image urls | []
  [centerAvatarImage] | string | the avatar to be displayed in center | null
  [centerAvatarSize] | number | diameter of centered avatar | 180
  [animationSpeed] | number | avatar movement speed  | 2.5
  [animateLines] | boolean | connect animated avatars with lines; static avatars have no lines | false
  [animateShadows] | boolean | if animated avatars have shadows (performance is better with shadows disabled); static avatars will always have shadows | false
  [animateOnDesktop] | boolean | avatar will move or stay static on desktop | true
  [animateOnMobile] | boolean | avatar will move or stay static on mobile | false
  [avatarsLocationsDesktop] | AvatarLocation[] | location of static avatars | AVATAR-LOCATIONS-<wbr>DEF-MOB
  [avatarLocationsMobile] | AvatarLocation[] | location of static avatars | AVATAR-LOCATIONS-<wbr>DEF-DESK

  **Note:** To optimize performance, avatar movement is stopped when component is not in view.

  ~~~
  ${template}
  ~~~

`;

const storyTemplate = `
<b-story-book-layout [title]="'Floating avatars'" style=" background: rgb(247,247,247);">
  <div style="
        position: relative;
        top: 0;
        left: 0;
        width: 90%;
        height: 400px;
        max-width: none;
  ">
    ${template}
  </div>

</b-story-book-layout>
`;

const toAdd = () => ({
  template: storyTemplate,
  props: {
    centerAvatarSize: number('centerAvatarSize', 180, {}, 'Props'),
    animationSpeed: number('animationSpeed', 2.5, {}, 'Props'),
    animateLines: boolean('animateLines', false, 'Props'),
    animateShadows: boolean('animateShadows', false, 'Props'),
    animateOnDesktop: boolean('animateOnDesktop', true, 'Props'),
    animateOnMobile: boolean('animateOnMobile', false, 'Props'),
    centerAvatarImage: text('centerAvatarImage', centerAvatarImageMock, 'Data'),
    avatarImages: object('avatarImages', avatarImagesMock, 'Data'),
    avatarsLocationsDesktop: object(
      'avatarsLocationsDesktop',
      AVATAR_LOCATIONS_DEF_DESK,
      'Data'
    ),
    avatarLocationsMobile: object(
      'avatarLocationsMobile',
      AVATAR_LOCATIONS_DEF_MOB,
      'Data'
    ),
  },
  moduleMetadata: {
    imports: [StoryBookLayoutModule, BrowserAnimationsModule, EyeCandyModule],
  },
});

story.add('Floating avatars', toAdd, { notes: { markdown: note } });
