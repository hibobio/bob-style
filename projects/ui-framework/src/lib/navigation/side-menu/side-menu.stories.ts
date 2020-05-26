import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import {
  object,
  text,
  withKnobs,
  number,
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { SideMenuModule } from './side-menu.module';
import { IconComponent } from '../../icons/icon.component';
import { IconsModule } from '../../icons/icons.module';
import { sideMenuMock1, sideMenuMock2 } from './side-menu.mock';
import { ButtonsModule } from '../../../lib/buttons/buttons.module';
import { SideMenuOption } from './side-menu.interface';
import { Icons } from '../../icons/icons.enum';
import { ButtonType } from '../../buttons/buttons.enum';
import { select } from '@storybook/addon-knobs';
import { TruncateTooltipType } from '../../popups/truncate-tooltip/truncate-tooltip.enum';

const story = storiesOf(ComponentGroupType.Navigation, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-side-menu [options]="options"
             [headerLabel]="headerLabel"
             [selectedId]="selectedId"
             [tooltipType]="tooltipType"
             (selectOption)="selectOption($event)">
    <b-square-button [icon]="icons.download"
                     [type]="buttonType.tertiary">
    </b-square-button>
</b-side-menu>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Side Menu'">
<div style="display: flex; flex-direction: column; align-items: center;">
  <div style="max-width: 300px;">

    <b-side-menu [options]="menuWithIcons"
                [headerLabel]="headerLabel || 'Menu with icons'"
                [selectedId]="selectedId"
                [tooltipType]="tooltipType"
                (selectOption)="selectOption($event)">
        <b-square-button [icon]="icons.download"
                        [type]="buttonType.tertiary">
        </b-square-button>
    </b-side-menu>

  </div>

  <hr style="width: 100%; margin: 60px 0 50px 0; border: 0; height: 0; border-top: 2px dashed #d2d2d2;">

  <div style="max-width: 300px;">

    <b-side-menu [options]="menuWithAvatars"
                [headerLabel]="headerLabel || 'Menu with avatars'"
                [selectedId]="selectedId"
                [tooltipType]="tooltipType"
                (selectOption)="selectOption($event)">
        <b-square-button [icon]="icons.download"
                        [type]="buttonType.tertiary">
        </b-square-button>
    </b-side-menu>

  </div>
</div>
</b-story-book-layout>
`;

const storyTemplate2 = `
<b-story-book-layout [title]="'Side Menu'">
  <div style="max-width: 300px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Side Menu

  #### Module
  *SideMenuModule*

  #### Properties
  Name | Type | Description
  --- | --- | --- | ---
  [headerLabel] | string | header of menu
  [options] | SideMenuOption[] | array of options
  [selectedId] | number / string | selected menu item index
  [tooltipType] | TruncateTooltipType | tooltip type (for when the option name or Avatar title/subtitle does not fit - css, material or none; defaults to 'auto')
  (selectOption) | EventEmitter<wbr>&lt;number/string&gt; | emits on option select
  - | ng-content | add actions to the header of the menu

  ~~~
  ${template}
  ~~~

  #### interface: SideMenuOption
  Name | Type | Description
  --- | --- | --- | ---
  id | number / string | option id
  displayName | string | option text
  icon? | Icons | main option icon
  avatar? | SideMenuOptionAvatar | data for avatar component
  actions? | MenuItem[] | data for menu
  disabled? | boolean | disabled state

  #### interface: SideMenuOptionAvatar
  Name | Type | Description
  --- | --- | --- | ---
  imageSource | string | avatar image url
  backgroundColor? | string | avatar bg color
  size? | AvatarSize | size
  title? | string | avatar title (name)
  subtitle? | string | subtitle
  badge? | AvatarBadge / BadgeConfig | avatar badge
  disabled? | boolean | disabled state
  icon? | Icons | icon (in place of avatar image)
  textIcon? | Icons | icon to be placed in the title/subtitle
  textIconPosition? | IconPosition | valid values are: <br>\
  'label',  'label<sub>-</sub>after' (to the left or right of title) and <br>\
  'value', 'value<sub>-</sub>after' (to the left or right of subtitle)
  textIconTooltip? | string | tooltip for the text icon


  #### Options data examples
  ~~~
  [
    {
      id: 'e0d65',
      displayName: 'Exercitationem',
      icon: Icons.folder,
      actions: [...]
    },

    ...

    {
      id: '07cc6',
      avatar: {
        imageSource: 'https://randomuser.me/api/portraits/men/94.jpg',
        title: 'Claudie Adrian',
        subtitle: 'Information systems technician',
        badge: 'AvatarBadge.rejected',
        textIcon: Icons.person_add,
        textIconTooltip: 'Added by John',
        textIconPosition: IconPosition.label_after
      },
      actions: [...]
    },

    ...

    {
      id: '50e67',
      avatar: {
        icon: {
          icon: Icons.person_reports,
          color: IconColor.dark
        },
        title: 'Reports 2'
      },
      actions: [...],
      disabled: true
    }
  ]
  ~~~
`;

story.add(
  'Side Menu',
  () => {
    return {
      template: storyTemplate,
      props: {
        icons: Icons,
        buttonType: ButtonType,
        headerLabel: text('headerLabel', '', 'Props'),
        menuWithIcons: object<SideMenuOption[]>(
          'menuWithIcons',
          sideMenuMock1,
          'Data'
        ),
        menuWithAvatars: object<SideMenuOption[]>(
          'menuWithAvatars',
          sideMenuMock2,
          'Data'
        ),
        selectedId: number('selectedId', 2, {}, 'Props'),
        tooltipType: select(
          'tooltipType',
          Object.values(TruncateTooltipType),
          TruncateTooltipType.auto,
          'Props'
        ),
        selectOption: action('Side menu select'),
      },
      moduleMetadata: {
        entryComponents: [IconComponent],
        imports: [
          BrowserAnimationsModule,
          SideMenuModule,
          StoryBookLayoutModule,
          IconsModule,
          ButtonsModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
