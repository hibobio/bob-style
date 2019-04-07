import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { boolean, object, select, text, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { SideMenuModule } from './side-menu.module';
import { IconComponent } from '../../icons/icon.component';
import { IconsModule } from '../../icons/icons.module';
import { getSideMenuOptionsMock } from './side-menu.mock';
import { SideMenuOption } from './side-menu-option/side-menu-option.interface';

const inputStories = storiesOf(ComponentGroupType.Navigation, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-side-menu [options]="options"
             (selectOption)="selectOption($event)">
</b-side-menu>
`;

const storyTemplate = `
<b-story-book-layout title="Side Menu">
  ${template}
</b-story-book-layout>
`;

const note = `
  ## Side Menu

  #### Module
  *SideMenuModule*

  #### Properties
  Name | Type | Description
  --- | --- | --- | ---
  options | SideMenuOption[] | array of options
  onSelectOption | Action | select option emitter

  ~~~
  ${template}
  ~~~
`;

const sideMenuOptionsMock = getSideMenuOptionsMock();

inputStories.add(
  'Side Menu',
  () => {
    return {
      template: storyTemplate,
      props: {
        options: object<SideMenuOption[]>('options', sideMenuOptionsMock),
        selectOption: action('SideMenuSelect'),
      },
      moduleMetadata: {
        entryComponents: [IconComponent],
        imports: [
          BrowserAnimationsModule,
          SideMenuModule,
          StoryBookLayoutModule,
          IconsModule,
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
