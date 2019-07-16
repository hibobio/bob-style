import { storiesOf } from '@storybook/angular';
import {
  array,
  boolean,
  number,
  object,
  select,
  text,
  withKnobs
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BreadcrumbsModule } from './breadcrumbs.module';
import { Breadcrumb, BreadcrumbNavButtons } from './breadcrumbs.interface';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

const inputStories = storiesOf(
  ComponentGroupType.Navigation,
  module
).addDecorator(withKnobs);

const componmentTemplate = `
<b-breadcrumbs [breadcrumbs]="breadcrumbs"
               [buttons]="buttons"
               [activeIndex]="activeIndex"
               (stepClick)="stepClick($event)"
               (nextClick)="nextClick($event)"
               (prevClick)="prevClick($event)">
</b-breadcrumbs>
`;

const template = `
<b-story-book-layout [title]="'breadcrumbs'">
  <div style="max-width: 900px;">
    ${componmentTemplate}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Breadcrumbs Element

  #### Module
  *BreadcrumbsModule*

  #### Properties
  Name | Type | Description
  --- | --- | ---
  breadcrumbs | Breadcrumb[] | breadcrumbs steps model
  buttons | BreadcrumbNavButtons | breadcrumbs navigation buttons model
  activeIndex | number | the active breadcrumb index
  stepClick | EventEmitter | returns step index
  nextClick | EventEmitter | returns the next step index
  prevClick | EventEmitter | returns the previous step index

  ~~~
  ${componmentTemplate}
  ~~~
`;

const breadcrumbsMock = [
  { title: 'Details', disabled: false },
  { title: 'Avatar', disabled: false },
  { title: 'To dos', disabled: false },
  { title: 'Summary', disabled: true }
];

const breadcrumbsButtons = {
  nextBtn: { label: 'Next', isVisible: true },
  backBtn: { label: 'Back', isVisible: true }
};

inputStories.add(
  'Breadcrumbs',
  () => {
    return {
      template,
      props: {
        breadcrumbs: object<Breadcrumb>('breadcrumbs', breadcrumbsMock),
        buttons: object<BreadcrumbNavButtons>('buttons', breadcrumbsButtons),
        activeIndex: number('activeIndex', 2),
        stepClick: action('stepClick'),
        nextClick: action('nextClick'),
        prevClick: action('prevClick')
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          BreadcrumbsModule,
          StoryBookLayoutModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
