import { storiesOf } from '@storybook/angular';
import {
  select,
  withKnobs,
  text,
  boolean,
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocialModule } from './social.module';
import { SearchModule } from '../../search/search/search.module';
import { Social } from './social.enum';

// @ts-ignore: md file and not a module
import formElemsPropsDoc from '../form-elements.properties.md';
import { FormElementsCommonProps } from '../form-elements.stories.common';

const story = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);

const template = `
<b-social [value]="value"
          [type]="type"
          [label]="label"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [required]="required"
          [readonly]="readonly"
          [hintMessage]="hintMessage"
          [warnMessage]="warnMessage"
          [errorMessage]="errorMessage"
          [focusOnInit]="focusOnInit"
          (socialInputChange)="socialInputChange($event)">
</b-social>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Social'">
  <div style="max-width: 300px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Social Element

  #### Module
  *SocialModule*

  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [type] | Social | type of input field | &nbsp;
  [value] | string | field value | &nbsp;
  [label] | string | field label (above input). By default, the Social type label is displayed, \
  but if [label] is passed, it will be displayed instead, \
  and the Social icon will be placed in placeholder (inside input) | &nbsp;
  [placeholder] | string | placeholder text (inside input) | 'username'
  (socialInputChange) |  EventEmitter<wbr>&lt;InputEvent&gt; | input events emitter | &nbsp;

  ${formElemsPropsDoc}

`;

story.add(
  'Social',
  () => {
    return {
      template: storyTemplate,
      props: {
        type: select('type', Social, Social.facebook),
        value: text('value', ''),

        ...FormElementsCommonProps('Social label', 'username', ''),

        socialInputChange: action('social'),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          SearchModule,
          StoryBookLayoutModule,
          SocialModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
