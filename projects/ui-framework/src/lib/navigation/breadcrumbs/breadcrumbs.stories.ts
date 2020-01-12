import { storiesOf } from '@storybook/angular';
import {
  object,
  select,
  withKnobs,
  boolean,
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BreadcrumbsModule } from './breadcrumbs.module';

import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BreadcrumbsType, BreadcrumbsStepState } from './breadcrumbs.enum';
import { ButtonsModule } from '../../buttons/buttons.module';
import { ButtonSize, ButtonType } from '../../buttons/buttons.enum';

const story = storiesOf(ComponentGroupType.Navigation, module).addDecorator(
  withKnobs
);

const componmentTemplate = `
<b-breadcrumbs [type]="type"
               [alwaysShowTitle]="alwaysShowTitle"
               [steps]="breadcrumbs"
               (stepClick)="onStepClick($event)">

  <div *ngIf="type !== types.vertical" class="buttons" style="display: flex">
    <b-button [size]="buttonSize.medium"
              [type]="buttonType.secondary"
              [text]="'Back'"
              style="margin-left: 16px">
    </b-button>
    <b-button [size]="buttonSize.medium"
              [type]="buttonType.primary"
              [text]="'Next'"
              style="margin-left: 16px">
    </b-button>
  </div>

</b-breadcrumbs>
`;

const template = `
<b-story-book-layout [title]="'Breadcrumbs'">
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
  type | BreadcrumbsType | breadcrumbs type
  breadcrumbs | Breadcrumb[] | breadcrumbs steps model
  alwaysShowTitle | boolean | if titles are always shown (for 'primary' type)
  stepClick | EventEmitter<wbr>&lt;number&gt; | emits clicked step index


  ~~~
  ${componmentTemplate}
  ~~~
`;

const breadcrumbsMock = [
  { title: 'Details', state: BreadcrumbsStepState.open },
  { title: 'Avatar', state: BreadcrumbsStepState.active },
  { title: 'To dos', state: BreadcrumbsStepState.closed },
  { title: 'Summary', state: BreadcrumbsStepState.closed },
];

story.add(
  'Breadcrumbs',
  () => {
    return {
      template,
      props: {
        types: BreadcrumbsType,
        buttonSize: ButtonSize,
        buttonType: ButtonType,

        type: select(
          'type',
          Object.values(BreadcrumbsType),
          BreadcrumbsType.primary
        ),
        alwaysShowTitle: boolean('alwaysShowTitle', false),

        breadcrumbs: object('breadcrumbs', breadcrumbsMock),
        onStepClick: action('onStepClick'),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          BreadcrumbsModule,
          StoryBookLayoutModule,
          ButtonsModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
