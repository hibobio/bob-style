import { storiesOf } from '@storybook/angular';
import {
  array,
  boolean,
  number,
  object,
  select,
  text,
  withKnobs
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

import { ComponentRendererModule } from './component-renderer.module';
import { ButtonComponent } from '../../buttons-indicators/buttons/button/button.component';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { AvatarComponent } from '../../buttons-indicators/avatar/avatar.component';
import { AvatarModule } from '../../buttons-indicators/avatar/avatar.module';
import { MockComponent } from '../mock.component';

const story = storiesOf(ComponentGroupType.Services, module).addDecorator(
  withKnobs
);

const template = `
<b-component-renderer [render]="componentData">
</b-component-renderer>
`;

const storyTemplate = `
<b-story-book-layout title="Component Renderer">
  <div style="padding: 50px; display:flex; justify-content: center; background: rgba(0,0,0,0.1);">
    ${template}
  </div>
</b-story-book-layout>
`;

const componentData = {
  component: MockComponent,
  attributes: {
    hostcss: {
      display: 'flex',
      alignItems: 'center'
    },
    slot1css: {
      marginRight: '10px'
    }
  },
  content: [
    {
      component: AvatarComponent,
      attributes: {
        imageSource: 'http://i.pravatar.cc/200',
        size: 'mini',
        isClickable: true
      },
      handlers: {
        clicked: action('Avatar was clicked')
      }
    },

    'Zoe Clark'
  ]
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
  component | Component | component reference | none
  attributes | object | object with component inputs | none (optional)
  content | string  / RenderedComponent / (string / RenderedComponent)[] | a string, another component or an array of strings and components to be passed as ng-content of the component | none (optional)


  #### componentData:

  \`\`\`
{
  component: MockComponent,

  attributes: {
    hostcss: {
      display: 'flex',
        alignItems: 'center'
    },
    slot1css: {
      marginRight: '10px'
    }
  },

  content: [

    {
      component: AvatarComponent,
      attributes: {
        imageSource: 'http://i.pravatar.cc/200',
        size: 'mini',
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
        componentData: object('componentData', componentData)
      },
      moduleMetadata: {
        declarations: [MockComponent],
        imports: [
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          ComponentRendererModule,
          ButtonsModule,
          AvatarModule
        ],
        entryComponents: [ButtonComponent, AvatarComponent, MockComponent]
      }
    };
  },
  { notes: { markdown: note } }
);
