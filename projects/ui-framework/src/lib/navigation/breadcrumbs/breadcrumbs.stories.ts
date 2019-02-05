import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { array, boolean, number, object, select, text, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BreadcrumbsModule } from './breadcrumbs.module';
import { Breadcrumb } from './breadcrumbs.interface';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

const inputStories = storiesOf(ComponentGroupType.Navigation, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-story-book-layout title="breadcrumbs">
  <b-breadcrumbs [breadcrumbs]="breadcrumbs"
                 (stepClick)="stepClick($event)">
  </b-breadcrumbs>
</b-story-book-layout>
`;

const note = `
  ## Breadcrumbs Element

  #### Properties

  Name | Type | Description
  --- | --- | ---
  breadcrumbs | Breadcrumb[] | breadcrumbs steps model
  stepClick | action | returns step index

  ~~~
  ${ template }
  ~~~
`;

const breadcrumbsMock = [
  { title: 'details', disabled: false },
  { title: 'avatar', disabled: false },
  { title: 'to dos', disabled: false },
  { title: 'summary', disabled: true },
];

inputStories.add(
  'Breadcrumbs',
  () => {
    return {
      template,
      props: {
        breadcrumbs: object<Breadcrumb>('breadcrumbs', breadcrumbsMock),
        stepClick: action(),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          BreadcrumbsModule,
          StoryBookLayoutModule,
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
