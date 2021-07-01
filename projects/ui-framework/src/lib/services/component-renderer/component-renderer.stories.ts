import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { object, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { AvatarComponent } from '../../avatar/avatar/avatar.component';
import { AvatarSize } from '../../avatar/avatar/avatar.enum';
import { AvatarModule } from '../../avatar/avatar/avatar.module';
import { ComponentGroupType, STORIES_KNOBS_OPTIONS } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TypographyModule } from '../../typography/typography.module';
import { MockComponentModule } from '../util-components/mock-component.module';
import { MockComponent } from '../util-components/mock.component';
import { ComponentRendererModule } from './component-renderer.module';

const story = storiesOf(ComponentGroupType.Services, module).addDecorator(
  withKnobs
);
const story2 = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const template = `<b-component-renderer [render]="renderData">
</b-component-renderer>`;

const storyTemplate = `
<b-story-book-layout [title]="'Component Renderer'" style="background-color: rgb(247,247,247);">
    ${template}
</b-story-book-layout>
`;

const renderData = {
  component: MockComponent,
  attributes: {
    hostcss: {
      display: 'flex',
      alignItems: 'center',
    },
    slot1css: {
      marginRight: '10px',
    },
  },
  content: [
    {
      component: AvatarComponent,
      attributes: {
        imageSource: 'http://i.pravatar.cc/200',
        size: AvatarSize.mini,
        isClickable: true,
      },
      handlers: {
        clicked: action('Avatar was clicked'),
      },
    },

    'Zoe Clark',
  ],
};

const note = `
  ## Component Renderer

  #### Module
  *ComponentRendererModule*


  ~~~
  ${template}
  ~~~


  #### [render: RenderedComponent] (properties of object describing Component to be rendered)
  Name | Type | Description | Default value
    --- | --- | --- | ---
  component | any | component reference | &nbsp;
  attributes | { inputName: inputValue } | object with component attributes (inputs) | &nbsp;
  content | string  / RenderedComponent / (string / RenderedComponent)[] |\
   a string, another component or an array of strings and components to be\
    passed as ng-content of the component | &nbsp;
  handlers | { eventName: handlerFunction() } | object that maps events\
   output by component to handler functions | &nbsp;


   #### Example

  #### renderData: RenderedComponent

  \`\`\`
{
    component: SomeComponent,

    attributes: {
      title: 'I can display avatar!'
    },

    content: [

      {
        component: AvatarComponent,
        attributes: {
          imageSource: 'http://i.pravatar.cc/200',
          size: AvatarSize.mini,
          isClickable: true
        },
        handlers: {
          clicked: () => {
            console.log('Avatar was clicked!');
          }
        }
      },

      'Zoe Clark'

    ]
}
\`\`\`

`;

const toAdd = () => {
  return {
    template: storyTemplate,
    props: {
      renderData: object('renderData', renderData),
    },
    moduleMetadata: {
      declarations: [],
      imports: [
        AvatarModule,
        StoryBookLayoutModule,
        BrowserAnimationsModule,
        ComponentRendererModule,
        TypographyModule,
        MockComponentModule,
      ],
      entryComponents: [AvatarComponent, MockComponent],
    },
  };
};

story.add('Component Renderer', toAdd, {
  notes: { markdown: note },
  knobs: STORIES_KNOBS_OPTIONS
});
story2.add('Component Renderer', toAdd, {
  notes: { markdown: note },
  knobs: STORIES_KNOBS_OPTIONS
});
