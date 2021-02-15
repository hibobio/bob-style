import { storiesOf } from '@storybook/angular';
import { text, select, boolean, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { ChipModule } from './chip.module';
import { ChipType } from '../chips.enum';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import {
  mockHobbies,
  mockAvatar,
  mockThings,
  mockAnimals,
  mockName,
} from '../../mock.const';
import { AvatarModule } from '../../avatar/avatar/avatar.module';
import { AvatarSize } from '../../avatar/avatar/avatar.enum';
import { IconsModule } from '../../icons/icons.module';
import { IconSize, Icons } from '../../icons/icons.enum';
import { randomFromArray } from '../../services/utils/functional-utils';
import { COLOR_PALETTE_SET1_COLOR_ORDER } from '../../services/color-service/color-palette.const';
import { ColorPalette } from '../../services/color-service/color-palette.enum';

const story = storiesOf(ComponentGroupType.Chips, module).addDecorator(
  withKnobs
);

const template = `
  <b-chip
    [type]="type"
    [textStrong]="textStrong"
    [text]="text"
    [icon]="icon"
    [color]="colorPalette[color]"
    [removable]="removable"
    [disabled]="disabled"
    [selected]="selected"
    (removed)="onRemove($event)">

    <b-avatar-image *ngIf="type === chipType.avatar"
                [imageSource]="imageSource"
                [size]="avatarSize.mini"
                [border]="true"></b-avatar-image>
  </b-chip>
`;

const note = `
  ## Chip
  #### Module
  *ChipModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [type] | ChipType | enum for setting the chip type \
  (tag, info, warning, error, success, avatar) | tag
  [text] | string | chip text | &nbsp;
  [textStrong] | string | bold text (displayed before [text]) | &nbsp;
  [icon] | Icons | icon (for Icon type chip) | &nbsp;
  [color] | ColorPalette/string | (custom) chip bg color | &nbsp;
  [class] | string/<wbr>string[]/<wbr>object | ngClass-compatible class(es) to be added to chip | &nbsp;
  [removable] | boolean | if chip has a 'x' button | false
  [disabled] | boolean | disables chip | false
  [selected] | boolean | selects chip | false
  (removed) | EventEmitter<wbr>&lt;MouseEvent&gt; | emitted on remove button click | &nbsp;

  ~~~
  ${template}
  ~~~

  <br>

  #### Note: Avatar & Icon Chip
  - For Avatar Chip, you need to provide \`[type]="ChipType.avatar"\` and \`<b-avatar>\` as \
  ng-content; Avatar [size] must be 'mini'.
  - For Icon Chip, you need to provide \`[type]="ChipType.icon"\` and \`[icon]="Icons.some_icon"\`.
`;

const storyTemplate = `
<b-story-book-layout [title]="'Chip'" style="background-color: rgb(250,250,250);">
  <div>
    ${template}

    <hr style="margin: 60px 0 50px 0; border: 0; height: 0; border-top: 2px dashed #d2d2d2;">

    <div style="display:flex; justify-content: center;">

     <b-chip style="margin: 10px;"
        [type]="'info'"
        [text]="text2"
        [removable]="removable"
        [disabled]="disabled"
        (removed)="onRemove($event)">
      </b-chip>

     <b-chip style="margin: 10px;"
        [type]="'success'"
        [text]="text3"
        [removable]="removable"
        [disabled]="disabled"
        (removed)="onRemove($event)">
      </b-chip>

      <b-chip style="margin: 10px;"
        [type]="'error'"
        [text]="text4"
        [removable]="removable"
        [disabled]="disabled"
        (removed)="onRemove($event)">
      </b-chip>

    </div>

    <div style="display:flex; justify-content: center;">

      <b-chip style="margin: 10px;"
        [type]="'avatar'"
        [text]="name1"
        [removable]="removable"
        [disabled]="disabled"
        [selected]="selected"
        (removed)="onRemove($event)">

        <b-avatar-image [imageSource]="avatar1"
                    [size]="avatarSize.mini"
                    [border]="true"></b-avatar-image>
      </b-chip>

      <b-chip style="margin: 10px;"
        [type]="'icon'"
        [text]="text1"
        [icon]="icon1"
        [removable]="removable"
        [disabled]="disabled"
        [selected]="selected"
        (removed)="onRemove($event)">
      </b-chip>

    </div>
  </div>
</b-story-book-layout>
`;

const icons = [
  Icons.calendar,
  Icons.chat,
  Icons.doc_add,
  Icons.doc_icon,
  Icons.email,
  Icons.harmonise,
  Icons.home_main,
  Icons.home,
  Icons.infinite,
  Icons.lock,
  Icons.megaphone,
  Icons.note,
  Icons.department_icon,
  Icons.person,
  Icons.person_check,
  Icons.print,
  Icons.success,
  Icons.tag,
];

const avatar1 = mockAvatar(),
  name1 = mockName(),
  text1 = mockThings().find((i) => i.split(' ').length > 1),
  icon1 = randomFromArray(icons, 1),
  text2 = mockThings().find((i) => i.split(' ').length > 1),
  text3 = mockHobbies().find((i) => i.split(' ').length > 1),
  text4 = mockAnimals().find((i) => i.split(' ').length > 1),
  imgSrc = mockAvatar();

story.add(
  'Chip',
  () => ({
    template: storyTemplate,
    props: {
      avatar1,
      name1,
      text1,
      icon1,

      text2,
      text3,
      text4,

      chipType: ChipType,
      avatarSize: AvatarSize,
      iconSize: IconSize,
      colorPalette: ColorPalette,
      type: select('type', Object.values(ChipType), ChipType.tag),
      text: text('text', mockName()),
      textStrong: text('textStrong', undefined),
      color: select('color', [0, ...COLOR_PALETTE_SET1_COLOR_ORDER], 0),
      removable: boolean('removable', false),
      disabled: boolean('disabled', false),
      selected: boolean('selected', false),
      imageSource: text('imageSource', imgSrc),
      icon: select('icon', icons, Icons.person),
      onRemove: action('Chip removed'),
    },
    moduleMetadata: {
      imports: [ChipModule, StoryBookLayoutModule, AvatarModule, IconsModule],
    },
  }),
  { notes: { markdown: note } }
);
