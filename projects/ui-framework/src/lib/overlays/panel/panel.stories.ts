import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { select, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { PanelModule } from '../panel/panel.module';
import { ButtonsModule } from '../../buttons';
import { TypographyModule } from '../../typography/typography.module';

const buttonStories = storiesOf(ComponentGroupType.Overlay, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-panel style="margin-right: 20px;">
  <b-button panel-trigger>
    open Syria
  </b-button>
  <div panel-content>
    <b-display-3>Syria</b-display-3>
    <p>Syria (Arabic: سوريا‎ Sūriyā), officially the Syrian Arab Republic
    (Arabic: الجمهورية العربية السورية‎ al-Jumhūrīyah al-ʻArabīyah as-Sūrīyah),
    is a country in Western Asia, bordering Lebanon and the Mediterranean Sea to
    the west, Turkey to the north, Iraq to the east, Jordan to the south,
    and Israel to the southwest.</p>
  </div>
</b-panel>

<b-panel>
  <b-button panel-trigger>
    open Iraq
  </b-button>
  <div panel-content>
    <b-display-3>Iraq</b-display-3>
    <p>raq (/ɪˈræk/, /ɪˈrɑːk/ (About this soundlisten) or /aɪˈræk/; Arabic: العراق‎ al-'Irāq; Kurdish: عێراق‎ Eraq),
    officially known as the Republic of Iraq (Arabic: جُمُهورية العِراق‎ ; Kurdish: کۆماری عێراق‎ Komari Eraq),
    is a country in Western Asia, bordered by Turkey to the north, Iran to the east, Kuwait to the southeast,
    Saudi Arabia to the south, Jordan to the southwest and Syria to the west.</p>
    <b-button>
    read more
  </b-button>
  </div>
</b-panel>
`;
const note = `
  ## Panel

  ~~~
  ${ template }
  ~~~
`;
buttonStories.add(
  'Panel', () => ({
    template,
    props: {},
    moduleMetadata: {
      imports: [
        PanelModule,
        ButtonsModule,
        TypographyModule,
      ],
    }
  }),
  { notes: { markdown: note } }
);

