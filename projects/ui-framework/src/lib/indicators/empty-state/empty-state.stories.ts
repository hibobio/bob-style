import { action } from '@storybook/addon-actions';
import { select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType } from '../../consts';
import { Icons } from '../../icons/icons.enum';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { EmptyStateModule } from './empty-state.module';

const story = storiesOf(ComponentGroupType.Indicators, module).addDecorator(
  withKnobs
);

const story2 = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const template = `<b-empty-state [config]="{
              text: text,
              icon: icon,
              buttonLabel: buttonLabel,
              imgSrc: imgSrc
            }"
  (buttonClick)="buttonClicked($event)"></b-empty-state>`;

const storyTemplate = `<b-story-book-layout [title]="'Empty State'">${template}</b-story-book-layout>`;

const note = `
  ## Empty State Element
  #### Module
  *EmptyStateModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [config] | EmptyStateConfig | { text, buttonLabel, icon, iconSize, imgSrc } | &nbsp;
  (buttonClicked) | EventEmitter | emited on button click | &nbsp;
  &lt;element top&gt;<wbr>&lt;/element&gt; | ng-content | to be put above icon and text (but below image) | &nbsp;
  &lt;element bottom&gt;<wbr>&lt;/element&gt; | ng-content | to be put below the button | &nbsp;

  ~~~
  ${template}
  ~~~

  #### (interface) EmptyStateConfig
  Name | Type
  --- | ---
  title | string
  text | string
  icon | Icons
  iconSize | IconSize
  buttonLabel |  string
  imgSrc | string / SafeResourceUrl
  button | Button
  buttonClick | () => void
  titleClass | string / string[] / NgClass
  textClass | string / string[] / NgClass
  buttonClass | string / string[] / NgClass
`;

const toAdd = () => {
  return {
    template: storyTemplate,
    props: {
      buttonClicked: action('button clicked'),

      text: text('text', 'Something empty here'),
      icon: select('icon', [0, ...Object.values(Icons).sort(), 0], Icons.cake),
      buttonLabel: text('buttonLabel', 'CLICK HERE'),
      imgSrc: select(
        'imgSrc',
        [0, 'http://images.hibob.com/img/emptyState_ee_profile_summary.png'],
        0
      ),
    },
    moduleMetadata: {
      imports: [EmptyStateModule, StoryBookLayoutModule],
    },
  };
};

story.add('Empty State', toAdd, {
  notes: { markdown: note },
  knobs: {
    timestamps: true,
    escapeHTML: false,
  },
});

story2.add('Empty State', toAdd, {
  notes: { markdown: note },
  knobs: {
    timestamps: true,
    escapeHTML: false,
  },
});
