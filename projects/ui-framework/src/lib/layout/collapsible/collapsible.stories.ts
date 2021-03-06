import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { boolean, object, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType, STORIES_KNOBS_OPTIONS } from '../../consts';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { mockText } from '../../mock.const';
import { ClickOutsideModule } from '../../services/utils/clickOutside.directive';
import { randomNumber } from '../../services/utils/functional-utils';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { COLLAPSIBLE_STYLE_DEF } from './collapsible.const';
import { CollapsibleModule } from './collapsible.module';

const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const template = `
  <b-collapsible #collapsible
         [title]="title"
         [config]="style"
         [animate]="animate"
         [startExpaned]="startExpaned"
         (click.outside)="collapsible.collapse()">
    {{ content }}
  </b-collapsible>
`;

const template2 = `
  <b-collapsible style="max-width: 300px" [title]="title"
         [config]="style2"
         [animate]="animate"
         [startExpaned]="startExpaned">
    {{ content2 }}
  </b-collapsible>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Collapsible'" style="background-color: rgb(245,245,245);text-align: left;">

<div>
  ${template}
  <br><br>
  ${template2}
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
  [config] | CollapsibleStyle | object containing: <br>\
  **sectionClass, headerClass, panelClass** (supports what ngClass binding supports - string, string[], object);<br>\
  **sectionStyle, headerStyle, panelStyle** (supports what ngStyle supports)<br>\
  chevronIcon (icon config, Icon interface) | COLLAPSIBLE<sub>-</sub>STYLE<sub>-</sub>DEF
  &lt;ng-content&gt; | template | pass anything to be put inside panel | &nbsp;
  &lt;ng-content header&gt; | template | pass div with attribute 'header' to be put in the header | &nbsp;

  #### Config example
  ~~~
  {
    "sectionClass": "bg-white brd rounded",
    "headerClass": "flx flx-row-align-y b-caption uppercase text-bold pad-l-24 pad-r-8 pad-y-4",
    "panelClass": "pad-8 brd-t b-caption",
    "chevronIcon": {
      "icon": "b-icon-arrow-drop-right",
      "size": "medium",
      "color": "dark"
    }
  }
  ~~~

`;

story.add(
  'Collapsible',
  () => {
    return {
      template: storyTemplate,
      props: {
        style: object('style', COLLAPSIBLE_STYLE_DEF),
        style2: object('style2', {
          sectionClass: 'bg-white brd rounded',
          headerClass:
            'flx flx-row-align-y b-caption uppercase text-bold pad-l-24 pad-r-8 pad-y-4',
          panelClass: 'pad-8 brd-t b-caption',

          chevronIcon: {
            icon: Icons.arrow_drop_right,
            size: IconSize.medium,
            color: IconColor.dark,
          },
        }),
        startExpaned: boolean('startExpaned', false),
        animate: boolean('animate', false),
        title: text('title', mockText(randomNumber(2, 5))),
        content: mockText(200),
        content2: mockText(100),
      },
      moduleMetadata: {
        declarations: [],
        imports: [
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          CollapsibleModule,
          ClickOutsideModule,
        ],
        entryComponents: [],
      },
    };
  },
  {
    notes: { markdown: note },
    knobs: STORIES_KNOBS_OPTIONS,
  }
);
