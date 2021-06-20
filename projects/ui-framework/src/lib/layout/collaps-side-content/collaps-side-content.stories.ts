import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType } from '../../consts';
import { ClickOutsideModule } from '../../services/utils/clickOutside.directive';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { CollapsSideContentModule } from './collaps-side-content.module';

const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(withKnobs);

const template = `
  <b-collaps-side-content #collapsible >
    {{ content }}
    <div style="
      height: 300px;
      width: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: grey"> content</div>
  </b-collaps-side-content>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Collapsible Side Content'" style="background-color: rgb(245,245,245);text-align: left;">

<div>
  ${template}
</div>

</b-story-book-layout>
`;

const note = `
  ## Collapsible Side Content

  #### Module
  *CollapsSideContentModule*

  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [startExpaned] | boolean | if should start open | false
  [animate] | boolean | add expand animation | false
  [config] | CollapsibleStyle | object containing: <br>\
  **sectionClass, headerClass, panelClass** (supports what ngClass binding supports - string, string[], object);<br>\
  **sectionStyle, headerStyle, panelStyle** (supports what ngStyle supports)<br>\
  chevronIcon (icon config, Icon interface) | COLLAPSIBLE<sub>-</sub>STYLE<sub>-</sub>DEF
  &lt;ng-content&gt; | template | pass anything to be put inside panel | &nbsp;
  &lt;ng-content header&gt; | template | pass div with attribute 'header' to be put in the header | &nbsp;

  #### Config example
  ~~~

  ~~~

`;

story.add('Collapsible Side Content', () => {
  return {
    template: storyTemplate, moduleMetadata: {
      declarations: [], imports: [
        StoryBookLayoutModule, BrowserAnimationsModule, CollapsSideContentModule, ClickOutsideModule,
      ], entryComponents: [],
    },
  };
}, { notes: { markdown: note } });
