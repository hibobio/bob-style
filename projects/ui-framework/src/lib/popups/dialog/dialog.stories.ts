import { storiesOf } from '@storybook/angular';
import { select, withKnobs } from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule } from './dialog.module';
import { DialogExampleModule } from './dialog-example.module';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { UtilComponentsModule } from '../../services/util-components/utilComponents.module';

const buttonStories = storiesOf(ComponentGroupType.Popups, module).addDecorator(
  withKnobs
);

const template = `
<b-dialog-example></b-dialog-example>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Dialog'">
    ${template}
  <b-stats></b-stats>
</b-story-book-layout>
`;

const note = `
  ## Dialog

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
    this.dialogButtonConfig = {} // DialogButtons config
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

`;
buttonStories.add(
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
        UtilComponentsModule
      ]
    }
  }),
  { notes: { markdown: note } }
);
