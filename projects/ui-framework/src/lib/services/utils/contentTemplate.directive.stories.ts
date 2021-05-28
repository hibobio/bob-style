import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { ContentTemplateModule } from './contentTemplate.directive';

const story = storiesOf(ComponentGroupType.Services, module).addDecorator(
  withKnobs
);
const story2 = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const template = `

`;

const storyTemplate = `
<b-story-book-layout [title]="'ContentTemplate Directive'" style="background-color: rgb(247,247,247);">

See notes

</b-story-book-layout>
`;

const note = `
  ## ContentTemplate Directive and ContentTemplateConsumer abstract class
  #### Module
  *ContentTemplateModule*

Directive and an abstract class that facilitates passing custom templates to components from outside.

The _'Provider'_ of the template needs to import <u>ContentTemplateModule</u> and use *contentTemplate directive to pass template to the 'consumer';

The _'Consumer'_ needs to extend class <u>ContentTemplateConsumer</u> and then it will have access to <u>contentTemplate</u> prop (for single template), and <u>getContentTemplate(name)</u> method (for multiple named templates).

--------------------------------

#### Single template example:
<br>
'Provider' component:

~~~
<consumer-component [items]="items">

    <ng-container *contentTemplate="let data=data">
      {{ data.title }}
    </ng-container>

</consumer-component>
~~~

'Consumer' component:

~~~
@Component({...})
class MyComponent extends ContentTemplateConsumer {...}

<ng-container *ngFor="let item of items">

    <ng-container *ngTemplateOutlet="contentTemplate;
                context: { data: item }">
    </ng-container>

</ng-container>
~~~

--------------------------------

#### Multiple templates example:
<br>
'Provider' component:

~~~
<consumer-component [items]="items">

    <ng-container *contentTemplate="let data=data; name:'header'">
        {{ data.title }}
    </ng-container>

    <ng-container *contentTemplate="let data=data; name:'footer'">
        {{ data.copyright }}
    </ng-container>

</consumer-component>
~~~

'Consumer' component template:

~~~
<ng-container *ngFor="let item of items">

    <header>
      <ng-container *ngTemplateOutlet="getContentTemplate('header');
                    context: { data: item.header }">
      </ng-container>
    </header>

    <footer>
      <ng-container *ngTemplateOutlet="getContentTemplate('footer');
                    context: { data: item.footer }">
      </ng-container>
    </footer>

</ng-container>
~~~



`;

const toAdd = () => {
  return {
    template: storyTemplate,
    props: {},
    moduleMetadata: {
      declarations: [],
      imports: [StoryBookLayoutModule, ContentTemplateModule],
      entryComponents: [],
    },
  };
};

story.add('contentTemplate', toAdd, { notes: { markdown: note } });
story2.add('contentTemplate', toAdd, { notes: { markdown: note } });
