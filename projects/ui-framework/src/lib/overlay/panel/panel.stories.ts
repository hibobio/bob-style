import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { select, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { PanelModule } from '../panel/panel.module';
import { ButtonsModule } from '../../buttons-indicators/buttons';
import { TypographyModule } from '../../typography/typography.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

const buttonStories = storiesOf(ComponentGroupType.Overlay, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-panel style="position: absolute; top: 20px; left: 20px;">
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

<b-panel style="position: absolute; bottom: 20px; right: 20px;">
  <b-button panel-trigger>
    Insights info
  </b-button>
  <div panel-content>
    <b-display-4>How can I improve "Headcount" display</b-display-4>
    <p>
    <b-subheading>Check people’s data</b-subheading>
    Make sure all your people have start and end dates. Employees with end-dates that occur before their start-date can’t be counted.
    </p>
    <p>
    <b-subheading>Check your permissions</b-subheading>
    Make sure you have SECRET PERMISSIONS
    </p>
    <b-button>
    read more
  </b-button>
  </div>
</b-panel>
`;

const storyTemplate = `
<b-story-book-layout title="Overlay panel">
  ${ template }
</b-story-book-layout>
`;

const note = `
  ## Panel

  ~~~
  ${ template }
  ~~~
`;
buttonStories.add(
  'Panel', () => ({
    template: storyTemplate,
    props: {},
    moduleMetadata: {
      imports: [
        PanelModule,
        ButtonsModule,
        TypographyModule,
        BrowserAnimationsModule,
        StoryBookLayoutModule,
      ],
    }
  }),
  { notes: { markdown: note } }
);

