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

const withMenuTemplate = `
  <b-basic-list [type]="type" [items]="items2"
                [showActionOnHover]="showActionOnHover">
    <b-menu *bBasicListAction="let item=item" [menu]="item.menu">
      <b-square-button menu-trigger
                        [type]="buttonType.tertiary"
                        [icon]="icons.three_dots"
                        [color]="iconColor.normal">
      </b-square-button>
    </b-menu>
  </b-basic-list>
`;

const withButtonTemplate = `
  <b-basic-list [type]="type" [items]="items1"
                [showActionOnHover]="showActionOnHover">
    <b-button *bBasicListAction="let item=item"
              [type]="buttonType.secondary"
              [size]="buttonSize.small"
              (clicked)="action('List item button clicked with item')(item)">
      Click me
    </b-button>
  </b-basic-list>
`;

const storyTemplate = `
  <b-story-book-layout [title]="'Basic List'">
    <div style="max-width: 650px;">

      <b-subheading style="margin-bottom: 16px;text-align: left;">Multiple labels</b-subheading>
      ${withMenuTemplate}

      <br><br>

      <b-subheading style="margin-bottom: 16px;text-align: left;">Single label</b-subheading>
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
  [type] | BasicListType | primary (grey border), secondary (grey background) | primary
  [showActionOnHover] | boolean | if true, will hide item Action when not hovering over item | false

  ~~~
  ${withMenuTemplate}
  ~~~

  ~~~
  ${withButtonTemplate}
  ~~~
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
