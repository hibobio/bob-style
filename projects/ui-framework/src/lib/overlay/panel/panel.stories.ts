import { storiesOf } from '@storybook/angular';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { PanelModule } from '../panel/panel.module';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { TypographyModule } from '../../typography/typography.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { CheckboxModule } from '../../form-elements/checkbox/checkbox.module';
import { PanelDefaultPosVer, PanelSize } from './panel.enum';
import { values } from 'lodash';

const buttonStories = storiesOf(ComponentGroupType.Overlay, module).addDecorator(withKnobs);

const panelSize = values(PanelSize);
const panelDefaultPosVer = values(PanelDefaultPosVer);

const template = `
<b-panel style="position: absolute; top: 20px; left: 20px;"
         [panelClass]="panelClass"
         [size]="panelSize"
         [showBackdrop]="showBackdrop"
         [defaultPosVer]="panelDefaultPosVer"
         [openOnHover]="openOnHover">
  <b-button panel-trigger>
    Time Off Policies info
  </b-button>
  <div panel-content>
    <b-display-3>Time Off Policies info</b-display-3>
    <p>A ‘policy’ is the a collection of rules which govern a type of leave.
    With bob you can add as many holiday policies as you need for your organisation.
    Before we create a policy, a note on what types are.
    <img style="display: block; width: 100%; margin-top: 20px;"
    src="https://downloads.intercomcdn.com/i/o/86579629/3d3ae5d60c93aed41996abed/Screen+Shot+2018-11-20+at+11.19.09.png" />
    </p>
  </div>
</b-panel>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Overlay panel'">
  ${ template }
</b-story-book-layout>
`;

const note = `
  ## Panel

  #### Module
  *PanelModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  panelClass | string | panel class | none
  size | PanelSize | panel size | "medium"
  defaultPosVer | PanelDefaultPosVer | default vertical position | PanelDefaultPosVer.above
  showBackdrop | boolean | show backdrop | true
  openOnHover | boolean | trigger panel open on hover (delay 300ms) | false

  ~~~
  ${ template }
  ~~~
`;
buttonStories.add(
  'Panel',
  () => ({
    template: storyTemplate,
    props: {
      panelClass: text('panelClass', 'my-panel-class'),
      panelSize: select('size', panelSize, PanelSize.medium),
      defaultPosVer: select('defaultPosVer', panelDefaultPosVer, PanelDefaultPosVer.above),
      showBackdrop: boolean('showBackdrop', true),
      openOnHover: boolean('openOnHover', false),
    },
    moduleMetadata: {
      imports: [
        PanelModule,
        ButtonsModule,
        TypographyModule,
        BrowserAnimationsModule,
        StoryBookLayoutModule,
        CheckboxModule
      ]
    }
  }),
  { notes: { markdown: note } }
);
