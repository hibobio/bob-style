import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { select, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { PanelModule } from '../panel/panel.module';
import { PanelExampleModule } from './panel-example.module';

const buttonStories = storiesOf(ComponentGroupType.Panel, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
  <b-panel-example>
  </b-panel-example>
`;
const note = `
  ## Panel example

  ~~~
  ${ template }
  ~~~
`;
buttonStories.add(
  'Panel example', () => ({
    template,
    props: {},
    moduleMetadata: {
      imports: [
        PanelExampleModule,
        PanelModule,
      ],
    }
  }),
  { notes: { markdown: note } }
);

