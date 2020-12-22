import { storiesOf } from '@storybook/angular';
import { select, text, withKnobs } from '@storybook/addon-knobs';
import { LightboxModule } from '../lightbox.module';
import { ComponentGroupType } from '../../../consts';
import { LightboxExampleModule } from '../lightbox-example.module';
import { ButtonsModule } from '../../../buttons/buttons.module';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';

const story = storiesOf(ComponentGroupType.Popups, module).addDecorator(
  withKnobs
);

const template = `<b-media-embed [url]="videoLink">
</b-media-embed>`;

const storyTemplate = `<b-story-book-layout [title]="'Media Embed'">
   <div>
  <b-media-embed [url]="embed === 'video' ? videoLink : imageLink">
  </b-media-embed>
  </div>
</b-story-book-layout>`;

const note = `
  ## MediaEmbedComponent

  #### Module
  *LightboxModule*

  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description
  --- | --- | --- | ---
  [url] | string |  image, youtube or vimeo link to show in lightbox (other URLs types not supported)
`;

story.add(
  'Media Embed',
  () => {
    return {
      template: storyTemplate,
      props: {
        embed: select('embed', ['image', 'video'], 'video'),
        imageLink: text(
          'imageLink',
          'https://prod-cdn.wetransfer.net/assets/curated/wallpaper/one_thumbnail_large-99b8c8faf500513d369d009ee036c7ac0b1e1c9eff85cc784e2e10f3a24970ae.jpg'
        ),
        videoLink: text(
          'videoLink',
          'https://www.youtube.com/embed/p3j2NYZ8FKs'
        ),
      },
      moduleMetadata: {
        imports: [
          LightboxModule,
          LightboxExampleModule,
          StoryBookLayoutModule,
          ButtonsModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
