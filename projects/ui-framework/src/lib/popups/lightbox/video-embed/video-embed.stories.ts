import { storiesOf } from '@storybook/angular';
import {
  select,
  text,
  withKnobs,
  boolean
} from '@storybook/addon-knobs/angular';
import { LightboxModule } from '../lightbox.module';
import { ComponentGroupType } from '../../../consts';
import { LightboxExampleModule } from '../lightbox-example.module';
import { ButtonsModule } from '../../../buttons-indicators/buttons/buttons.module';
import { UtilComponentsModule } from '../../../services/util-components/utilComponents.module';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';

const lightboxStories = storiesOf(
  ComponentGroupType.Popups,
  module
).addDecorator(withKnobs);

const template = `<b-video-embed [url]="videoLink">
</b-video-embed>`;

const storyTemplate = `<b-story-book-layout [title]="'Video Embed'">
   <div> ${template}</div>
</b-story-book-layout>`;

const note = `
  ## VideoEmbedComponent

  #### Module
  *LightboxModule*

    ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description
  --- | --- | --- | ---
  url | string |  youtube or vimeo link to show in lightbox (other video URLs not supported)
`;

lightboxStories.add(
  'Video Embed',
  () => {
    return {
      template: storyTemplate,
      props: {
        videoLink: text('url', 'https://www.youtube.com/watch?v=BvQ571eAOZE')
      },
      moduleMetadata: {
        imports: [
          LightboxModule,
          LightboxExampleModule,
          StoryBookLayoutModule,
          ButtonsModule,
          UtilComponentsModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
