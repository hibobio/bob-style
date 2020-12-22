import { storiesOf } from '@storybook/angular';
import {
  object,
  withKnobs,
  select,
  boolean,
  number,
} from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import {
  simpleUID,
  randomNumber,
  randomFromArray,
} from '../../services/utils/functional-utils';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChipListModule } from './chip-list.module';
import { ChipType, ChipListAlign, ChipListSelectable } from '../chips.enum';
import { mockAvatar, mockNames, mockCities } from '../../mock.const';
import { Icons } from '../../icons/icons.enum';

const story = storiesOf(ComponentGroupType.Chips, module).addDecorator(
  withKnobs
);

const icons = randomFromArray(
  [
    Icons.calendar,
    Icons.chat,
    Icons.doc_add,
    Icons.doc_icon,
    Icons.email,
    Icons.harmonise,
    Icons.home_main,
    Icons.home,
    Icons.infinite,
    Icons.lock,
    Icons.megaphone,
    Icons.note,
    Icons.department_icon,
    Icons.person,
    Icons.person_check,
    Icons.print,
    Icons.success,
    Icons.tag,
  ],
  null
);

const tabIconsArray = [
  Icons.department_icon,
  Icons.person,
  Icons.person_check,
  Icons.person_add,
  Icons.person_manager,
  Icons.person_peer,
  Icons.person_reports,
];

const tabIcons = randomFromArray([tabIconsArray], null);
const tabButtonIcons = randomFromArray([tabIconsArray], null);

const chips = mockNames(10).map((chip, index) => ({
  text: chip,
  id: simpleUID(),
  imageSource: mockAvatar(),
  selected: randomNumber() > 90,
  disabled: randomNumber() > 90,
  icon: icons[index],
}));

const chipTabs = mockCities(3).map((chip, index) => ({
  text: chip,
  id: simpleUID(),
  icon: tabIcons[index],
}));

const chipButtonTabs = mockCities(3).map((chip, index) => ({
  text: chip,
  id: simpleUID(),
  icon: tabButtonIcons[index],
}));

const template = `
  <b-chip-list [chips]="chips"
               [activeIndex]="activeIndex"
               [config]="{
                  type: type,
                  align: align,
                  removable: removable,
                  focusable: focusable,
                  selectable: selectable,
                  disabled: disabled
                }"
                (removed)="onChipRemove($event)"
                (clicked)="onChipClicked($event)"
                (selected)="onChipSelected($event)"
                (keyPressed)="onChipKeydown($event)">
  </b-chip-list>
`;

const templateTabs = `
  <b-chip-list [chips]="chipTabs"
               [activeIndex]="activeTabIndex"
               [config]="{
                  type: chipType.tab
                }"
                (selected)="onChipSelected($event)">
  </b-chip-list>
`;

const templateButtonTabs = `
  <b-chip-list [chips]="chipButtonTabs"
               [activeIndex]="activeTabButtonIndex"
               [config]="{
                  type: chipType.button
                }"
                (selected)="onChipSelected($event)">
  </b-chip-list>
`;

const note = `
  ## Chip List

  #### Module
  *ChipListModule*

  #### Properties
  Name | Type | Description
  --- | --- | ---
  [chips] | Chip[] / string[] | Array of Chip objects (will also accept an array of strings)
  **[config]** | ChipListConfig | list configuration (options common to all \
    chips, including: type, removable, selectable, focusable, disabled, align)
  [activeIndex] | number | index of selected chip (can be used to select chip \
    in single-selectable mode)
  (removed) | EventEmitter<wbr>&lt;Chip&gt; | emited on chip removed event
  (clicked) | EventEmitter<wbr>&lt;Chip&gt; | emited on chip clicked event
  (selected) | EventEmitter<wbr>&lt;Chip&gt; | emited on chip selected event \
  (fired only if chip is selectable)
  (keyPressed) | EventEmitter<wbr>&lt;{chip: Chip, event: KeyboardEvent}&gt; \
  | emited on chip KeyDown event

  ~~~
  ${template}
  ~~~

  <br>

  #### interface ChipListConfig
  Name | Type | Description
  --- | --- | ---
  type | ChipType | chip type (tag, tab, avatar, icon, info, warning, error, success) | tag
  removable | boolean | if chip has remove (x) button | false
  selectable | boolean / ChipListSelectable | single (only 1 chip \
     selected at a time), multi (multiple chips can be selected). \
     setting to true equals <u>multi</u> | false
  focusable | boolean | if true, focused chip will be indicated via a \
   slightly darker background color (usefull for keyboard navigation) | false
  disabled | boolean | disables chip list | false
  align | ChipListAlign | controls chip alignment (left, right, center, justify) | left

  <br>

  #### Tabs view example
  ~~~
  ${templateTabs}
  ~~~

  <br>

  #### "Button Tabs" view example
  ~~~
  ${templateButtonTabs}
  ~~~

`;

const storyTemplate = `
<b-story-book-layout [title]="'Chip List'">
<div>
  <div style="max-width:500px;">

  ${template}
    <p style="margin: 20px 0 0 0">
      * Set chip type to Avatar (in Knobs panel) to see Avatar Chip List
    </p>
  </div>

  <hr style="margin: 60px 0 50px 0; border: 0; height: 0; border-top: 2px dashed #d2d2d2;">

  <h4>Tabs view: </h4>
  ${templateTabs}

  <hr style="margin: 60px 0 50px 0; border: 0; height: 0; border-top: 2px dashed #d2d2d2;">

  <h4>"Button Tabs" view: </h4>
  ${templateButtonTabs}

</div>
</b-story-book-layout>
`;

story.add(
  'Chip List',
  () => ({
    template: storyTemplate,
    props: {
      chipTabs: chipTabs,
      chipButtonTabs: chipButtonTabs,
      chipType: ChipType,
      activeTabIndex: 1,
      activeTabButtonIndex: 0,
      type: select('type', Object.values(ChipType), ChipType.tag),
      align: select('align', Object.values(ChipListAlign), ChipListAlign.left),
      removable: boolean('removable', true),
      focusable: boolean('focusable', true),
      disabled: boolean('disabled', false),
      selectable: select(
        'selectable',
        Object.values(ChipListSelectable),
        ChipListSelectable.multi
      ),
      activeIndex: number('activeIndex', 0),
      chips: object('chips', chips),
      onChipRemove: action('Chip removed'),
      onChipClicked: action('Chip clicked'),
      onChipSelected: action('Chip selected'),
      onChipKeydown: action('Chip key pressed'),
    },
    moduleMetadata: {
      imports: [ChipListModule, StoryBookLayoutModule, BrowserAnimationsModule],
    },
  }),
  { notes: { markdown: note } }
);
