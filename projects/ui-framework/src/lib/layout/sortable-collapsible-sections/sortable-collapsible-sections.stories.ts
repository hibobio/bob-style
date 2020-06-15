import { storiesOf } from '@storybook/angular';
import { object, withKnobs } from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { action } from '@storybook/addon-actions';
import { makeArray, simpleUID } from '../../services/utils/functional-utils';
import { ButtonType } from '../../buttons/buttons.enum';
import { IconColor, Icons } from '../../icons/icons.enum';
import { SortableCollapsibleSectionsModule } from './sortable-collapsible-sections.module';
import { ButtonsModule } from '../../buttons/buttons.module';
import { TextareaModule } from '../../form-elements/textarea/textarea.module';

const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const template = `
<b-sortable-collapsible-sections [sections]="sections"
                                 (dragStart)="onDragStart($event)"
                                 (dragEnd)="onDragEnd($event)"
                                 (orderChanged)="onDropped($event)"
                                 (opened)="onOpened($event)"
                                 (closed)="onClosed($event)">

    <b-action-menu-button *bCollapsibleHeader="let data=data; let index=index"
                          [menuItems]="data.menuItems"
                          [buttonConfig]="data.buttonConfig">
    </b-action-menu-button>

    <b-textarea *bCollapsibleContent="let data=data; let index=index"
                value="{{data | json}}">
    </b-textarea>
</b-sortable-collapsible-sections>

`;

const templateExample = `
<b-soratble-collapsible-sections [sections]="sections$ | async">
    <b-action-menu-button *bCollapsibleHeader="let data=data; let index=index"
                          [menuItems]="data.menuItems"
                          [buttonConfig]="data.buttonConfig">
    </b-action-menu-button>
    <my-collpasiblie-content-component *bCollapsibleContent="let data=data; let index=index"
                                       [myInput1]="data.myData1"
                                       [myInput2]="data.myData2">
    </my-collpasiblie-content-component>
</b-soratble-collapsible-sections>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Sortable Collapsible Sections'" style="background-color: rgb(245,245,245); text-align: left;">
<div style="width: 100%; max-width: none;">
    ${ template }
</div>
</b-story-book-layout>
`;

const note = `
  ## Sortable Collapsible Sections

  #### Module
  *SortableCollapsibleSectionsModule*

  #### Properties
  Name | Type | Description
  --- | --- | --- | ---
  [sections] | SortableCollapsibleSection[] | configuration for the sections the collapsible iterates over |
  (dragStart) | EventEmitter<number> | drag start event with the index of the dragged section
  (dragEnd) | EventEmitter<number> | drag end event with the index of the dragged section
  (orderChanged) | EventEmitter<SortableCollapsibleDropped> | drop event with the material drop event and the current state of the sections
  (opened) | EventEmitter<number> | collapsible opened event with the index of the section
  (closed) | EventEmitter<number> | collapsible closed event with the index of the section

  #### Template
  ~~~
  ${ template }
  ~~~

  #### Interface
  ~~~
  interface SortableCollapsibleSection {
    title?: string;
    description?: string;
    expanded?: boolean;
    collapsibleOptions?: CollapsibleOptions;
    contentData?: any;
    headerData?: any;
    trackId?: string | number;
  }
  ~~~

  ~~~
  SortableCollapsibleDropped {
    currentIndex: number;
    previousIndex: number;
    sections: SortableCollapsibleSection[];
  }
  ~~~

  #### Example
  ~~~
  ${ templateExample }
  ~~~
`;

const sectionsMock = makeArray(10)
  .map((_, index) => {
    return {
      id: simpleUID('trackId_', 8),
      title: `Section ${ index }`,
      description: `Section ${ index } description`,
      expanded: index === 1,
      contentData: { a: `foo ${ index }`, b: `bar ${ index }` },
      headerData: {
        buttonConfig: {
          type: ButtonType.tertiary,
          icon: Icons.three_dots_vert,
          color: IconColor.normal
        },
        menuItems: [
          { label: 'add', action: () => console.log('add ' + index) },
          { label: 'remove', action: () => console.log('remove ' + index) },
        ]
      },
    };
  });

story.add(
  'Sortable Collapsible Sections',
  () => {
    return {
      template: storyTemplate,
      props: {
        sections: object('sections', sectionsMock),
        onPanelClosed: action('Panel closed'),
        onDragStart: action('dragStart'),
        onDragEnd: action('dragEnd'),
        onDropped: action('orderChanged'),
        onOpened: action('opened'),
        onClosed: action('closed')
      },
      moduleMetadata: {
        declarations: [],
        imports: [
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          SortableCollapsibleSectionsModule,
          ButtonsModule,
          TextareaModule,
        ],
        entryComponents: [],
      },
    };
  },
  { notes: { markdown: note } }
);
