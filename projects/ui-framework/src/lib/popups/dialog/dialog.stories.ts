import { storiesOf } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { ButtonsModule } from '../../buttons/buttons.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule } from './dialog.module';
import { DialogExampleModule } from './dialog-example.module';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

const story = storiesOf(ComponentGroupType.Popups, module).addDecorator(
  withKnobs
);

const template = `
<b-dialog-example></b-dialog-example>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Dialog'">
    ${template}
</b-story-book-layout>
`;

const note = `
  ## Dialog

  #### Module
  *DialogModule*


  ## How to use

  Trigger:

  ~~~
  constructor(
    private dialogService: DialogService,
  ) {
  }
  openDialog() {
    const dialogRef: MatDialogRef<YourDialogComponent> = this.dialogService
      .openDialog(
        YourDialogComponent,
        {
          size: DialogSize.small (medium, large),
          panelClass: 'your-dialog-class',
          data: {
            ...anyData,
            title: 'Some title'
          },
        }
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

  YourDialogComponent:

  ~~~
@Component({
  selector: 'b-dialog-example-dialog',
  template: \`
    <b-dialog [dialogTitle]="data.title" [dialogButtons]="dialogButtonConfig">
      <div b-dialog-sub-title> // optional
        subtitle content
      </div>
      <div b-dialog-content>
        ...
        your content
        ...
      </div>
    </b-dialog>
  \`
})
export class YourDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  @ViewChild(DialogComponent, { static: true }) dialog: DialogComponent;

  dialogButtonConfig: DialogButtons;

  ngOnInit(): void {
    this.dialogButtonConfig = {
      ok: {
        label: 'Ok',
        type: ButtonType.primary,
        class: 'ok-button-666',
        disabled: false,
        action: ...
      },
      cancel: {
        label: 'Cancel',
        class: 'cancel-button-666',
        disabled: false,
        action: ...
      },
    ...
    }
  }
}
  ~~~


  ----------------

  ### button actions

  If action is not provided in the buttons config, clicking on the button will close the dialog immediately (unless you subscribe to \`(clickedOK)\` and/or \`(clickedCancel)\` outputs of b-dialog - see below).

  The action methods should return either:

  - no return - will close the dialog.
  - \`return Promise.resolve();\` &nbsp;- will close the dialog.
  - \`return Promise.resolve(false);\` &nbsp;- will keep the dialog open, showProgress will be set to false.
  - <s>return Promise.reject()</s> &nbsp;- will also keep the dialog open, but this approach is not recommended.

  Between \`Promise.resolve(false)\` and \`Promise.reject()\`, please choose <u>Promise.resolve(false)</u>.

  To do something asynchronously before closing the dialog, return a <u>new Promise</u> that resolves to one of the above:

  ~~~
  action: () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('Pizza');
      }, 3000);
    });
  },
  ~~~

  While the asynchronous action is performed, the Progress preloader is shown.

  #### Intercepting button clicks
  If you subscribe to b-dialog's \`(clickedOK)\` and/or \`(clickedCancel)\` outputs, the respective button actions (from the button config) are not called, because it is assumed that the consumer takes responsibility of the actions.
  You can then use \`[showProgress]\`, \`[showConfirmation]\` and \`[closeDialog]\` inputs of the b-dialog to perform respective functions (see below). Don't forget to \`detectChanges()\` if you change these bindings asynchronously.

  ----------------

  #### b-dialog Properties
  Name | Type | Description
  --- | --- | ---
  [dialogTitle] | string |
  [dialogButtons] | DialogButtons | buttons configuration
  [showProgress] | boolean | force show progress preloader and preloaderMessage. buttons are disabled while showProgress is true
  [showConfirmation] | boolean | force show Confirmation message. <br>if boolean value is provided, Confirmation sup-popup is assumed to be controlled by consumer. Omit this input for automatic Confirmation control
  [closeDialog] | boolean | if set to true, dialog will close (this is an equivalent of calling \`closeDialog()\` method). other values have no effect
  (clickedOK) | EventEmitter<wbr>&lt;void&gt; | emits on OK button click
  (clickedCancel) | EventEmitter<wbr>&lt;void&gt; | emits on Cancel button click

  **Note:** If you subscribe to \`(clickedOK)\` and/or \`(clickedCancel)\` outputs, the respective button actions (from the button config) are not called, because it is assumed that the consumer takes responsibility of the actions.

  #### b-dialog Methods
  Name | Description
  --- | ---
  closeDialog() | will close the dialog

  to call b-dialog methods, use \`@ViewChild\` to get the component:

  ~~~
  @ViewChild(DialogComponent, { static: true }) dialog: DialogComponent;

  ...
  this.dialog.closeDialog();
  ~~~

  an alternative for calling \`closeDialog()\` method is to set \`[closeDialog]\` input to true.

  ----------------

  #### interface DialogConfig
  Name | Type | Description
  --- | --- | ---
  size | DialogSize | small (480px), medium (720px), large (960px), xLarge (90vw)
  panelClass | string | css class to be added to the dialog popup
  data | any | any data, to be injected into your dialog component via \`@Inject(MAT_DIALOG_DATA) public data: any\`

  #### interface DialogButton
  Name | Type | Description
  --- | --- | ---
  label | string | button text
  class | boolean | class to be added to the button
  type | ButtonType | button type (primary, negative...)
  disabled | boolean | if is disabled
  action | Function | will be invoked on button click

  #### interface DialogConfirmation
  Name | Type | Description
  --- | --- | ---
  title | string | confirm dialog title
  subTitle | string | subtitle
  buttonLabel | string | confirm button text
  buttonClass | string | confirm button class
  buttonType | ButtonType | confirm button type (primary, negative...)

  #### interface DialogButtons
  Name | Type | Description
  --- | --- | ---
  ok | DialogButton | ok button config
  cancel | DialogButton | cancel button config
  preloaderMessage | string | message to show while performing asynchronous button action (while showProgress is true)
  confirmation | DialogConfirmation | confirmation dialog config

  #### content selectors
  Name | Description
  --- | ---
  b-dialog-above-header | will be displayed above the title
  b-dialog-sub-title | the sub title of the dialog
  b-dialog-content | the dialog content
  b-dialog-confirmation | template for the confirmatiom window
  b-dialog-preloader-message | template for the progress message (shown beneath preloader anmation)
  mat-dialog-footer-left | content to be placed on the left of the footer (opposite from the ok/cancel buttons)

`;
story.add(
  'Dialog',
  () => ({
    template: storyTemplate,
    props: {},
    moduleMetadata: {
      imports: [
        DialogModule,
        ButtonsModule,
        BrowserAnimationsModule,
        DialogExampleModule,
        StoryBookLayoutModule,
      ],
    },
  }),
  { notes: { markdown: note } }
);
