import { storiesOf } from '@storybook/angular';
import { object, text, number, withKnobs } from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { mockAvatar } from '../../mock.const';
import { EyeCandyModule } from '../eye-candy.module';
import { UtilComponentsModule } from '../../services/util-components/utilComponents.module';

const story = storiesOf(ComponentGroupType.EyeCandy, module).addDecorator(
  withKnobs
);

const avatarNum = 30;
const avatarImagesMock: string[] = Array
  .from(Array(avatarNum), (_, i) => {
    return mockAvatar();
  });
const centerAvatarImageMock = mockAvatar();

const template = `
  <b-floating-avatars [avatarImages]="avatarImages"
                      [centerAvatarImage]="centerAvatarImage"
                      [speed]="speed">
  </b-floating-avatars>
`;

const note = `
  ## Floating avatars

  #### Module
  *EyeCandyModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  avatarImages | string[] | Array of image urls | []
  centerAvatarImage | string | the avatar to be displayed in center | null
  speed | number | avatar movement speed is around value | 4

  ~~~
  ${ template }
  ~~~

`;

const storyTemplate = `
<b-story-book-layout [title]="'Floating avatars'" style=" background: rgb(247,247,247);">
  <div style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        max-width: none;
  ">
    ${ template }
  </div>

</b-story-book-layout>
`;

const toAdd = () => ({
  template: storyTemplate,
  props: {
    speed: number('speed', 4),
    centerAvatarImage: text('centerAvatarImage', centerAvatarImageMock),
    avatarImages: object('avatarImages', avatarImagesMock),
  },
  moduleMetadata: {
    imports: [
      StoryBookLayoutModule,
      BrowserAnimationsModule,
      EyeCandyModule,
      UtilComponentsModule,
    ]
  }
});

story.add('Floating avatars', toAdd, { notes: { markdown: note } });
