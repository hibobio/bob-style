import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { boolean, object, select, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ButtonSize, ButtonType } from '../../buttons/buttons.enum';
import { ButtonsModule } from '../../buttons/buttons.module';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BreadcrumbsStepState, BreadcrumbsType } from './breadcrumbs.enum';
import { BreadcrumbsModule } from './breadcrumbs.module';

const story = storiesOf(ComponentGroupType.Navigation, module).addDecorator(
  withKnobs
);

const componmentTemplate = `
<b-breadcrumbs [type]="type"
               [alwaysShowTitle]="alwaysShowTitle"
               [steps]="breadcrumbs"
               [clickable]="clickable"
               (stepClick)="onStepClick($event)">

  <div *ngIf="type !== types.vertical" class="buttons" style="display: flex">
    <b-button [size]="buttonSize.small"
              [type]="buttonType.secondary"
              [text]="'Previous'"
              style="margin-left: 16px">
    </b-button>
    <b-button [size]="buttonSize.small"
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
  [type] | BreadcrumbsType | breadcrumbs type
  [steps] | Breadcrumb[] | breadcrumbs steps model
  [alwaysShowTitle] | boolean | if titles are always shown (for 'primary' type)
  [clickable] | if 'open' steps are clickable | true
  (stepClick) | EventEmitter<wbr>&lt;number&gt; | emits clicked step index


  ~~~
  ${componmentTemplate}
  ~~~
`;

const breadcrumbsMock = [
  { title: 'Welcome', state: BreadcrumbsStepState.success },
  { title: 'Details', state: BreadcrumbsStepState.active },
  { title: 'More Dedails', state: BreadcrumbsStepState.successActive },
  { title: 'Avatar', state: BreadcrumbsStepState.open },
  { title: 'To dos', state: BreadcrumbsStepState.warning },
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
          BreadcrumbsType.vertical
        ),
        alwaysShowTitle: boolean('alwaysShowTitle', false),
        clickable: boolean('clickable', true),

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
