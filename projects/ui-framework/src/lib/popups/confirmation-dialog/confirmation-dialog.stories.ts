import { storiesOf } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { ButtonsModule } from '../../buttons/buttons.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { ConfirmationDialogModule } from './confirmation-dialog.module';
import { ConfirmationDialogExampleModule } from './confirmation-dialog-example.module';

const story = storiesOf(ComponentGroupType.Popups, module).addDecorator(
  withKnobs
);

const template = `
<b-confirmation-dialog-example></b-confirmation-dialog-example>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Confirmation dialog'">
    ${template}
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
      title: '...';
      ...
      buttonConfig: {
        ok: {
          label: 'OK',
          class: 'my-dialog-ok-button',
          type: ButtonType.negative
          ...
        }
      }
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


  #### interface ConfirmationDialogConfig
  Name | Type | Description
  --- | --- | ---
  buttonConfig | ConfirmationDialogButtons | ok/cancel buttons config
  title | string | Dialog title
  message | string | Dialog message
  class | string | Class to be added to the dialog panel

  #### interface ConfirmationDialogButtons
  Name | Type | Description
  --- | --- | ---
  ok | DialogButton | ok button config
  cancel | DialogButton | cancel button config

  #### interface DialogButton
  Name | Type | Description
  --- | --- | ---
  label | string | button text
  class | boolean | class to be added to the button
  type | ButtonType | button type (primary, negative...)
  disabled | boolean | if is disabled
  action | Function | will be invoked on button click

`;
story.add(
  'Confirmation dialog',
  () => ({
    template: storyTemplate,
    props: {},
    moduleMetadata: {
      imports: [
        ButtonsModule,
        BrowserAnimationsModule,
        StoryBookLayoutModule,
        ConfirmationDialogModule,
        ConfirmationDialogExampleModule,
      ],
    },
  }),
  { notes: { markdown: note } }
);
