import { storiesOf } from '@storybook/angular';
import {
  select,
  withKnobs,
  object,
  array,
  boolean
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../../consts';
import { ButtonsModule } from '../../../buttons-indicators/buttons/buttons.module';
import { TypographyModule } from '../../../typography/typography.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
import { MultiListModule } from './multi-list.module';
import { SelectGroupOption } from '../list.interface';
import { AvatarComponent } from '../../../buttons-indicators/avatar/avatar.component';
import { AvatarModule } from '../../../buttons-indicators/avatar/avatar.module';

const buttonStories = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const template = `
<b-multi-list [options]="options"
              [showSingleGroupHeader]="showSingleGroupHeader"
              (selectChange)="selectChange($event)">
</b-multi-list>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Multi list'">
  <div style="flex:1; max-width: 350px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Multi list

  #### Module
  *MultiListModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  options | SelectGroupOption[] | model of selection group | none
  selectChange | action | returns ListChange | none
  showSingleGroupHeader | boolean | displays single group with group header | false
  maxHeight | number | component max height | 352 (8 rows)

  ~~~
  ${template}
  ~~~
`;

const groupNum = 6;
const optionsNum = 3;

const optionsMock: SelectGroupOption[] = Array.from(Array(groupNum), (_, i) => {
  return {
    groupName: `Basic Info G${i} - header`,
    options: Array.from(Array(optionsNum), (_, k) => {
      return {
        value: `Basic Info G${i}_E${k} - option`,
        id: i * optionsNum + k,
        selected: false,
        prefixComponent: {
          component: AvatarComponent,
          attributes: {
            imageSource:
              'https://pixel.nymag.com/imgs/daily/vulture/2017/03/23/23-han-solo.w330.h330.jpg'
          }
        }
      };
    })
  };
});
optionsMock[1].options[0].disabled = true;
optionsMock[1].options[2].selected = true;

optionsMock[2].options[0].selected = true;
optionsMock[2].options[1].selected = true;
optionsMock[2].options[2].selected = true;
optionsMock[2].options[0].disabled = true;
optionsMock[2].options[1].disabled = true;
// optionsMock[2].options[2].disabled = true;

buttonStories.add(
  'Multi list',
  () => ({
    template: storyTemplate,
    props: {
      selectChange: action('Multi list change'),
      options: object<SelectGroupOption>('options', optionsMock),
      showSingleGroupHeader: boolean('showSingleGroupHeader', true)
    },
    moduleMetadata: {
      imports: [
        MultiListModule,
        ButtonsModule,
        TypographyModule,
        BrowserAnimationsModule,
        StoryBookLayoutModule,
        AvatarModule
      ],
      entryComponents: [AvatarComponent]
    }
  }),
  { notes: { markdown: note } }
);
