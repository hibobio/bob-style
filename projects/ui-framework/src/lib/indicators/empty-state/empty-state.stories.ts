import { storiesOf } from '@storybook/angular';
import { withKnobs, select, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { EmptyStateModule } from './empty-state.module';
import { Icons } from '../../icons/icons.enum';

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
        [
          0,
          'https://raw.githubusercontent.com/hibobio/hibob-files/master/img/emptyState_ee_profile_summary.png?token=AAP3IOWBZDZ6CYVRQ2QNWXK7FJW5A',
        ],
        0
      ),
    },
    moduleMetadata: {
      imports: [EmptyStateModule, StoryBookLayoutModule],
    },
  };
};

story.add('Empty State', toAdd, { notes: { markdown: note } });

story2.add('Empty State', toAdd, { notes: { markdown: note } });
