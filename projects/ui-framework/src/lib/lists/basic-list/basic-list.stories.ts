import { storiesOf } from '@storybook/angular';
import {
  withKnobs,
  object,
  select,
  boolean,
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { Icons, IconColor } from '../../icons/icons.enum';
import { BasicListModule } from './basic-list.module';
import { MenuModule } from '../../navigation/menu/menu.module';
import { ButtonsModule } from '../../buttons/buttons.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonType, ButtonSize } from '../../buttons/buttons.enum';
import { basicListItems1, basicListItems2 } from './basic-list.mock';
import { BasicListType } from './basic-list.enum';
import { TypographyModule } from '../../typography/typography.module';

const story = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const withMenuTemplate = `<b-basic-list [type]="type" [items]="items2"
                [titles]="['City', 'Country']"
                [showActionOnHover]="showActionOnHover"
                (clicked)="onItemClick($event)">
    <b-menu *bBasicListAction="let item=item" [menu]="item.menu">
      <b-square-button menu-trigger
                        [type]="buttonType.tertiary"
                        [icon]="icons.three_dots"
                        [color]="iconColor.normal">
      </b-square-button>
    </b-menu>
  </b-basic-list>`;

const withButtonTemplate = `<b-basic-list [type]="type" [items]="items1"
                [titles]="['Hobbies']"
                [showActionOnHover]="showActionOnHover"
                (clicked)="onItemClick($event)">
    <b-button *bBasicListAction="let item=item"
              [disabled]="item.disabled"
              [type]="buttonType.secondary"
              [size]="buttonSize.small"
              (clicked)="action('List item button clicked with item')(item)">
      Click me
    </b-button>
  </b-basic-list>`;

const storyTemplate = `
  <b-story-book-layout [title]="'Basic List'">
    <div style="max-width: 650px;">

      ${withMenuTemplate}

      <br><br>

      ${withButtonTemplate}

    </div>
  </b-story-book-layout>
`;

const note = `
  ## Basic list

  #### Module
  *BasicListModule*

  #### Properties
  Name | Type | Description | Default
  --- | --- | --- | ---
  [items] | BasicListItem[] | List of items to display | &nbsp;
  [titles] | string[] | column titles (length should be equal to number of item labels) | &nbsp;
  [type] | BasicListType | primary (grey border), secondary (grey background) | primary
  [showActionOnHover] | boolean | if true, will hide item Action when not hovering over item | false
  (clicked) | EventEmitter<wbr>&lt;BasicListItem&gt; | Emitted on item (row) click | &nbsp;
  &lt;elem \\*bBasicListAction&gt; | ng-content | passing an element with \
  <u>*bBasicListAction</u> directive attached will put it in the item \
  action slot. If the element needs access to the item data, you can \
  use: <u>*bBasicListAction="let item=item"</u> (item will be the \
    corresponding item of your BasicListItem[] array) | &nbsp;

  ~~~
  ${withMenuTemplate}
  ~~~

  ~~~
  ${withButtonTemplate}
  ~~~

  #### interface: BasicListItem
  Name | Type | Description
  --- | --- | ---
  label | string / string[] | item text
  icon? | Icons | item icon
`;

story.add(
  'Basic list',
  () => ({
    template: storyTemplate,
    props: {
      buttonType: ButtonType,
      buttonSize: ButtonSize,
      icons: Icons,
      iconColor: IconColor,
      action,

      type: select(
        'type',
        Object.values(BasicListType),
        BasicListType.primary,
        'Props'
      ),

      showActionOnHover: boolean('showActionOnHover', false, 'Props'),

      items1: object('items 1', basicListItems1, 'Data'),
      items2: object('items 2', basicListItems2, 'Data'),

      onItemClick: action('Item clicked'),
    },
    moduleMetadata: {
      imports: [
        BasicListModule,
        MenuModule,
        StoryBookLayoutModule,
        ButtonsModule,
        BrowserAnimationsModule,
        TypographyModule,
      ],
    },
  }),
  { notes: { markdown: note } }
);
