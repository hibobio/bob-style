import {storiesOf} from '@storybook/angular';
import { object, number, withKnobs, select } from '@storybook/addon-knobs/angular';
import {action} from '@storybook/addon-actions';
import {ComponentGroupType} from '../../consts';
import {StoryBookLayoutModule} from '../../story-book-layout/story-book-layout.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AvatarLayoutModule} from './avatar-layout.module';
import {UtilsService} from '../../services/utils/utils.service';
import {AvatarModule} from '../avatar/avatar.module';
import {mockAvatar, mockNames} from '../../mock.const';
import {AvatarOrientation, AvatarSize} from '../avatar/avatar.enum';
import {options} from 'tsconfig-paths/lib/options';
import {ChipType} from '../../chips/chips.enum';

const avatarLayoutStories = storiesOf(ComponentGroupType.Avatar, module).addDecorator(
  withKnobs
);

const template = `
<b-avatar-layout
  (itemsInRowChange)="itemsInRowChange($event)"
  [align]="align"
  >
  <b-avatar *ngFor="let item of items"
  [size]="avatarSize"
  [title]="item.name"
  [imageSource]="item.avatar"
  [orientation]="avatarOrientation"
  ></b-avatar>
</b-avatar-layout>
`;

const note = `
  ## Avatar Layout Element
  #### Module
  *AvatarModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  itemsInRowChange | Event Emitter | makes an output when item in row count changes

  ~~~
  <b-avatar-layout
    (itemsInRowChange)="itemsInRowChange">
  </b-avatar-layout>
  ~~~
`;

const storyTemplate = `
<b-story-book-layout [title]="'Avatar Layout'">
    ${template}
</b-story-book-layout>
`;
const alignOptions = ['center', 'left'];


avatarLayoutStories.add(
  'Avatar Layout',
  () => {
    return {
      template: storyTemplate,
      props: {
        align: select('align', alignOptions, alignOptions[0] ),
        avatarSize: AvatarSize.small,
        avatarOrientation: AvatarOrientation.vertical,
        items: object('items', new Array(11).fill(0).map((x => ({
          avatar: mockAvatar(),
          name: mockNames(1)
        })))),
        itemsAmount: number('item amount', 3),
        itemsInRowChange: action('items in row changed', {clearOnStoryChange: true})
      },
      moduleMetadata: {
        providers: [UtilsService],
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          AvatarLayoutModule,
          AvatarModule,
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
