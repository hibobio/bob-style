import { storiesOf } from '@storybook/angular';
import {
  select,
  text,
  withKnobs,
  boolean
} from '@storybook/addon-knobs/angular';
import { LightboxModule } from './lightbox.module';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { LightboxExampleModule } from './lightbox-example.module';
import { ButtonsModule } from '../../buttons/buttons.module';
import { UtilComponentsModule } from '../../services/util-components/utilComponents.module';

const lightboxStories = storiesOf(
  ComponentGroupType.Popups,
  module
).addDecorator(withKnobs);

const template = `<b-lightbox-example
                  [imageLink]="imageLink"
                  [videoLink]="videoLink"
                  [showInLightbox]="showInLightbox"
                  [fillScreen]="fillScreen">
                </b-lightbox-example>`;

const storyTemplate = `<b-story-book-layout [title]="'Lightbox'">
    ${template}

</b-story-book-layout>`;

const note = `
  ## LightboxService

  #### Module
  *LightboxModule*

  #### Call arguments
  Name | Type | Description
  --- | --- | --- | ---
   <i>interface</i>   | **LightboxConfig** | config object with properties:
  component | RenderedComponent | component to be rendered in lightbox
  image | string | valid image URL to show in lightbox
  video | string | embedable youtube or vimeo link to show in lightbox (other URLs will throw error)
  fillScreen | boolean | if content should fill most of the screen (may be important for components)

  #### Return object properties

  Name | Type | Description
  --- | --- | ---
  <i>interface</i>   | **LightboxData** | service call will return an    object containing:
  overlayRef | OverlayRef | reference to the the overlay instance
  lightboxComponentRef | ComponentRef&lt;LightboxComponent&gt; | reference to the Lightbox component
  config | LightboxConfig | the original configuration, with which the service was called, but with sanitized video/image links (if any)

  #### Example call

  \`\`\`
this.lightbox = this.lightboxService.showLightbox({
      video: 'https://www.youtube.com/embed/p3j2NYZ8FKs'
    })
  \`\`\`

  \`\`\`
this.lightbox = this.lightboxService.showLightbox({
      component: {
        component: AvatarComponent,
        attributes: {
          title: 'John Malkovich',
          subtitle: 'American actor',
          orientation: 'vertical',
          imageSource: 'https://randomuser.me/api/portraits/men/1.jpg',
          size: AvatarSize.large
        }
      },
      fillScreen: true
    })
  \`\`\`

`;

lightboxStories.add(
  'Lightbox',
  () => {
    return {
      template: storyTemplate,
      props: {
        showInLightbox: select(
          'showInLightbox',
          ['image', 'video', 'component'],
          'image'
        ),
        imageLink: text(
          'imageLink',
          'https://prod-cdn.wetransfer.net/assets/curated/wallpaper/one_thumbnail_large-99b8c8faf500513d369d009ee036c7ac0b1e1c9eff85cc784e2e10f3a24970ae.jpg'
        ),
        videoLink: text(
          'videoLink',
          'https://www.youtube.com/embed/p3j2NYZ8FKs'
        ),
        fillScreen: boolean('fillScreen', false)
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
