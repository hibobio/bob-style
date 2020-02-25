import { storiesOf } from '@storybook/angular';
import { object, withKnobs, select } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AvatarLayoutModule } from './avatar-layout.module';
import { UtilsService } from '../../services/utils/utils.service';
import { AvatarModule } from '../avatar/avatar.module';
import { mockAvatar, mockName } from '../../mock.const';
import { AvatarOrientation, AvatarSize } from '../avatar/avatar.enum';

const story = storiesOf(ComponentGroupType.Avatar, module).addDecorator(
  withKnobs
);

const template = `
<b-avatar-layout
  (itemsInRowChange)="itemsInRowChange($event)"
  [align]="align">

    <b-avatar *ngFor="let item of items"
      [size]="avatarSize.small"
      [title]="item.name"
      [imageSource]="item.avatar"
      [orientation]="avatarOrientation.vertical"></b-avatar>

</b-avatar-layout>
`;

const note = `
  ## Avatar Layout Element
  #### Module
  *AvatarModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  (itemsInRowChange) | EventEmitter<wbr>&lt;number&gt; |  emits when item in row count changes | &nbsp;

  ~~~
  ${template}
  ~~~
`;

const storyTemplate = `
<b-story-book-layout [title]="'Avatar Layout'">
    ${template}
</b-story-book-layout>
`;
const alignOptions = ['center', 'left'];

story.add(
  'Avatar Layout',
  () => {
    return {
      template: storyTemplate,
      props: {
        itemsInRowChange: action('items in row changed', {
          clearOnStoryChange: true,
        }),
        avatarSize: AvatarSize,
        avatarOrientation: AvatarOrientation,
        align: select('align', alignOptions, alignOptions[0]),
        items: object(
          'items',
          new Array(11).fill(0).map(x => ({
            avatar: mockAvatar(),
            name: mockName(),
          }))
        ),
      },
      moduleMetadata: {
        providers: [UtilsService],
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          AvatarLayoutModule,
          AvatarModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
