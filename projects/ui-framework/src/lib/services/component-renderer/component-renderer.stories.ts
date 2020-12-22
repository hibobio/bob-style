import { storiesOf } from '@storybook/angular';
import { object, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

import { ComponentRendererModule } from './component-renderer.module';

import { AvatarComponent } from '../../avatar/avatar/avatar.component';
import { MockComponent } from '../util-components/mock.component';
import { TypographyModule } from '../../typography/typography.module';
import { AvatarModule } from '../../avatar/avatar/avatar.module';
import { AvatarSize } from '../../avatar/avatar/avatar.enum';
import { MockComponentModule } from '../util-components/mock-component.module';

const story = storiesOf(ComponentGroupType.Services, module).addDecorator(
  withKnobs
);

const template = `
<b-component-renderer [render]="renderData">
</b-component-renderer>
`;

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
  component: MockComponent,

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

story.add(
  'Component Renderer',
  () => {
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
  },
  { notes: { markdown: note } }
);
