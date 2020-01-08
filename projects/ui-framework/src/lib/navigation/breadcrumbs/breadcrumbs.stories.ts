import { storiesOf } from '@storybook/angular';
import {
  number,
  object,
  select,
  withKnobs,
  boolean,
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BreadcrumbsModule } from './breadcrumbs.module';
import { Breadcrumb, BreadcrumbNavButtons } from './breadcrumbs.interface';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BreadcrumbsType, BreadcrumbsStepState } from './breadcrumbs.enum';

const story = storiesOf(ComponentGroupType.Navigation, module).addDecorator(
  withKnobs
);

const componmentTemplate = `
<b-breadcrumbs [type]="type"
               [steps]="breadcrumbs"
               [activeStep]="activeIndex"
               [buttons]="buttons"
               [config]="{
                 isOpen: configIsOpen,
                 alwaysShowTitle: configAlwaysShowTitle,
                 autoChangeSteps: configAutoChangeSteps,
                 autoDisableButtons: configAutoDisableButtons,
                 autoHideButtons: configAutoHideButtons
               }"
               (stepChange)="stepChange($event)">
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
  type | BreadcrumbsType | breadcrumbs type
  toggleStrategy | BreadcrumbsToggleStrategy | determine the title toggle behaviour
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
  { title: 'Details', state: BreadcrumbsStepState.active },
  { title: 'Avatar', state: BreadcrumbsStepState.closed },
  { title: 'To dos', state: BreadcrumbsStepState.closed },
  { title: 'Summary', state: BreadcrumbsStepState.closed },
];

const breadcrumbsButtons = {
  nextBtn: { label: 'Next', isVisible: true },
  backBtn: { label: 'Back', isVisible: true },
};

story.add(
  'Breadcrumbs',
  () => {
    return {
      template,
      props: {
        type: select(
          'type',
          Object.values(BreadcrumbsType),
          BreadcrumbsType.primary
        ),

        activeIndex: number('activeIndex', 0),

        configIsOpen: boolean('configIsOpen', false),

        configAlwaysShowTitle: boolean('configAlwaysShowTitle', false),

        configAutoChangeSteps: boolean('configAutoChangeSteps', true),

        configAutoDisableButtons: boolean('configAutoDisableButtons', false),
        configAutoHideButtons: boolean('configAutoHideButtons', true),

        breadcrumbs: object('breadcrumbs', breadcrumbsMock),

        buttons: object('buttons', breadcrumbsButtons),

        stepChange: action('stepChange'),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          BreadcrumbsModule,
          StoryBookLayoutModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
