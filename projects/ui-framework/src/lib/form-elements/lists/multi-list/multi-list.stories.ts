import { storiesOf } from '@storybook/angular';
import { select, withKnobs, object, array, boolean } from '@storybook/addon-knobs/angular';
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

const buttonStories = storiesOf(ComponentGroupType.FormElements, module).addDecorator(withKnobs);

const template = `
<b-multi-list style="width: 400px;"
              [options]="options"
              [value]="value"
              [showSingleGroupHeader]="showSingleGroupHeader"
              (selectChange)="selectChange($event)">
</b-multi-list>
`;

const storyTemplate = `
<b-story-book-layout title="Single select">
  ${template}
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
  value | (string or number) | selected id | none
  selectChange | action | returns selected id | none
  showSingleGroupHeader | boolean | displays single group with group header | false
  maxHeight | number | component max height | 352 (8 rows)

  ~~~
  ${template}
  ~~~
`;

const optionsMock: SelectGroupOption[] = Array.from(Array(1), (_, i) => {
  return {
    groupName: `Basic Info G${i} - header`,
    options: Array.from(Array(4), (_, k) => {
      return {
        value: `Basic Info G${i}_E${k} - option`,
        id: i * 4 + k,
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

buttonStories.add(
  'Multi list',
  () => ({
    template: storyTemplate,
    props: {
      selectChange: action(),
      options: object<SelectGroupOption>('options', optionsMock),
      value: array('value', [1, 3, 6, 8, 9, 10, 11]),
      showSingleGroupHeader: boolean('showSingleGroupHeader', false)
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
