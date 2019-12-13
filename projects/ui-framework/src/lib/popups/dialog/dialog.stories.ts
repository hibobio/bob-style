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
  trigger:

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
          data: {...yourData},
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
    <b-dialog dialogTitle="{{ yourTitle }}" [dialogButtons]="dialogButtonConfig">
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
  dialogButtonConfig: DialogButtons;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

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


  Module:

  ~~~
  @NgModule({
    declarations: [
      YourDialogComponent,
    ],
    imports: [
      CommonModule,
      DialogModule,
    ],
    entryComponents: [
      YourDialogComponent,
    ],
    providers: [
      DialogService,
    ]
  })
  export class YourModule {
  }
  ~~~

  #### interface DialogButtons
  Name | Type | Description
  --- | --- | ---
  ok | DialogButton | ok button config
  cancel | DialogButton | cancel button config
  preloaderMessage | string | message to show while loading data
  confirmation | DialogConfirmation | confirmation dialog config

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
