import { storiesOf } from '@storybook/angular';
import { boolean, object, text, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { mockText } from '../../mock.const';
import { randomNumber } from '../../services/utils/functional-utils';
import { CollapsibleModule } from './collapsible.module';
import { COLLAPSIBLE_STYLE_DEF } from './collapsible.const';
import { CollapsibleComponent } from './collapsible.component';

const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const template = `
  <b-collapsible [title]="title"
         [style]="style"
         [animate]="animate"
         [startExpaned]="startExpaned">
    {{ content }}
  </b-collapsible>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Collapsible'" style="background-color: rgb(245,245,245);text-align: left;">

<div>
${template}
</div>

</b-story-book-layout>
`;

const note = `
  ## Collapsible

  #### Module
  *CollapsibleModule*

  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [id] | string | section id | random id
  [startExpaned] | boolean | if should start open | false
  [animate] | boolean | add expand animation | false
  [title] | string | header text | &nbsp;
  [style] | CollapsibleStyle | object containing: <br>\
  **sectionClass, headerClass, panelClass** (supports what ngClass binding supports - string, string[], object);<br>\
  **sectionStyle, headerStyle, panelStyle** (supports what ngStyle supports) | COLLAPSIBLE<sub>-</sub>STYLE<sub>-</sub>DEF
  &lt;ng-content&gt; | template | pass anything to be put inside panel
  &lt;ng-content header&gt; | template | pass div with attribute 'header' to be put in the header

`;

story.add(
  'Collapsible',
  () => {
    return {
      template: storyTemplate,
      props: {
        style: object('style', COLLAPSIBLE_STYLE_DEF),
        startExpaned: boolean('startExpaned', false),
        animate: boolean('animate', false),
        title: text('title', mockText(randomNumber(2, 5))),
        content: text('content', mockText(200)),
      },
      moduleMetadata: {
        declarations: [],
        imports: [
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          CollapsibleModule,
        ],
        entryComponents: [],
      },
    };
  },
  { notes: { markdown: note } }
);
