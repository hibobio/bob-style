import { storiesOf } from '@storybook/angular';
import { select, withKnobs } from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { UtilComponentsModule } from '../../services/util-components/utilComponents.module';
import { ConfirmationDialogModule } from './confirmation-dialog.module';
import { ConfirmationDialogExampleModule } from './confirmation-dialog-example.module';

const buttonStories = storiesOf(ComponentGroupType.Popups, module).addDecorator(
  withKnobs
);

const template = `
<b-confirmation-dialog-example></b-confirmation-dialog-example>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Confirmation dialog'">
    ${ template }
</b-story-book-layout>
`;

const note = `
  ## Confirmation dialog

  #### Module
  *ConfirmationDialogModule*

  ## How to use
  trigger:

  ~~~
  constructor(
    private confirmationDialogService: ConfirmationDialogService,
  ) {
  }

  openDialog() {
    const dialogConfig: ConfirmationDialogConfig = {
      ...
    };

    const dialogRef: MatDialogRef<ConfirmationDialogComponent> = this.confirmationDialogService
      .openDialog(
        dialogConfig
      );

    // observable containing the response when dialog is closed
    // onSuccess res contains value
    // onCancel or on X, result is undefined
    dialogRef.beforeClosed()
      .subscribe(res => {
        console.log('res', res);
      });
  }
  ~~~
`;
buttonStories.add(
  'Confirmation dialog',
  () => ({
    template: storyTemplate,
    props: {},
    moduleMetadata: {
      imports: [
        ButtonsModule,
        BrowserAnimationsModule,
        StoryBookLayoutModule,
        UtilComponentsModule,
        ConfirmationDialogModule,
        ConfirmationDialogExampleModule,
      ]
    }
  }),
  { notes: { markdown: note } }
);
