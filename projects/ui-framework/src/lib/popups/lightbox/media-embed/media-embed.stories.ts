import { storiesOf } from '@storybook/angular';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { LightboxModule } from '../lightbox.module';
import { ComponentGroupType } from '../../../consts';
import { LightboxExampleModule } from '../lightbox-example.module';
import { ButtonsModule } from '../../../buttons/buttons.module';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
import { action } from '@storybook/addon-actions';

const story = storiesOf(ComponentGroupType.Popups, module).addDecorator(
  withKnobs
);

const template = `<b-media-embed [url]="videoLink">
</b-media-embed>`;

const storyTemplate = `<b-story-book-layout [title]="'Media Embed'">
   <div>
  <b-media-embed [url]="embed === 'video' ? videoLink : imageLink" [inline]="inline">
  </b-media-embed>
  </div>
</b-story-book-layout>`;

const note = `
  ## MediaEmbedComponent

  #### Module
  *LightboxModule*

  ~~~
  <b-media-embed [url]="videoUrl"></b-media-embed>
  ~~~

  #### Properties
  Name | Type | Description
  --- | --- | --- | ---
  [url] | string |  image, youtube or vimeo link to show in lightbox (other URLs types not supported)
  [inline] | boolean | if true, the component will embed the img/video in itself (instead of using lightbox) | false
  (clicked) | EventEmitter<wbr>&lt;VideoData&gt; | if someone is listening to this output, the event will emit an object with video data (including thumbnail image) and the lightbox with the video will <u>not</u> be opened (it becomes the responsibilty of consumer) | &nbsp;
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
        inline: boolean('inline', false),
        clicked: action('clicked'),
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
