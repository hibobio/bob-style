import { values } from 'lodash';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { number, select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { CardType } from '../cards.enum';
import { CardsModule } from '../cards.module';

const story = storiesOf(ComponentGroupType.Cards, module).addDecorator(
  withKnobs
);

const template = `
  <b-card-image [card]="{
                title: title,
                imageUrl: imageUrl,
                imageRatio: imageRatio,
                imageStyle: {
                  backgroundSize: 'auto 70%',
                  backgroundColor: '#fbf5d7'
                },
                action: onAction
              }"
              [type]="type"
              (clicked)="onClick($event)">
  </b-card-image>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Image Card'" style=" background: rgb(247,247,247);">
  <div style="max-width:260px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Image Card

  #### Module
  *CardsModule*

  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [type] | CardType | Card theme | primary
  [card] | ImageCard | data for the Add New card | &nbsp;
  (clicked) | EventEmitter | handler of card click | &nbsp;

  #### [card: ImageCard]
  Name | Type | Description
  --- | --- | ---
  title | string | card title
  imageUrl | string / SafeResourceUrl | img url
  imageRatio? | number | image width/height relation <br>(literally "width divided by height") (defaults to 1.5)
  imageClass?, titleClass? | string / string[] / NgClass | add class to image or title container
  imageStyle?, titleStyle? | GenericObject | ngStyle-compatible css to add to image or title container <br>(**note:** image is displayed as background image)
  action? | Function | handler of card click


`;

const img = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='304' height='205' fill='none' viewBox='0 0 304 205'%3E%3Cdefs/%3E%3Cpath fill='%23F3F2F2' d='M-10 0h324.44v205H-10z'/%3E%3Cpath fill='%23E2E2E2' d='M59.52 33.2c0-1.1.9-2 2-2h181.4a2 2 0 012 2v87.13H59.51V33.2z'/%3E%3Cpath fill='%23fff' d='M59.52 120.33h185.39V205H59.52z'/%3E%3Cpath fill='%23fff' d='M86.26 63.5c0-1.1.9-2 2-2h128.91a1 1 0 011 1V203a2 2 0 01-2 2H88.27a2 2 0 01-2-2V63.5z'/%3E%3Ccircle cx='209.71' cy='48.58' r='8.47' fill='%239D9D9D'/%3E%3Cpath fill='%239D9D9D' d='M96.96 73.98h71.3v10.7h-71.3z'/%3E%3Crect width='57.04' height='10.7' x='123.7' y='172.02' fill='%239D9D9D' rx='2'/%3E%3Cpath fill='%239D9D9D' d='M96.96 88.24h92.7v10.7h-92.7zM96.96 112.3h28.52v3.57H96.96zM96.96 119.44h111.41v3.57H96.96zM96.96 126.56h111.41v3.57H96.96zM96.96 133.7h85.57v3.57H96.96zM97 141h66v3H97z'/%3E%3C/svg%3E`;

story.add(
  'Image Card',
  () => {
    return {
      template: storyTemplate,
      props: {
        type: select(
          'type',
          Object.values(CardType).filter(
            (t) => t === CardType.regular || t === CardType.large
          ),
          CardType.regular
        ),
        title: text('title', 'Guy and Gal pointing at a honeycomb folder'),
        imageUrl: text(
          'imageUrl',
          'http://images.hibob.com/img/dcmnt-empty-state-img.svg'
        ),
        imageRatio: number('imageRatio', 1.5),
        onClick: action('Card clicked'),
        onAction: action('Action called'),
        imgDef: img,
      },
      moduleMetadata: {
        imports: [StoryBookLayoutModule, BrowserAnimationsModule, CardsModule],
      },
    };
  },
  { notes: { markdown: note } }
);
