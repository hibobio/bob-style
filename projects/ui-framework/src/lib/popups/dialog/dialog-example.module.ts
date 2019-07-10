import { Component, Inject, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypographyModule } from '../../typography/typography.module';
import { DialogModule } from './dialog.module';
import { DialogService } from './dialog-service/dialog.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { FormElementsModule } from '../../form-elements/form-elements.module';
import { InputEventType } from '../../form-elements/form-elements.enum';
import { InputEvent } from '../../form-elements/input/input.interface';
import { SelectGroupOption } from '../../form-elements/lists/list.interface';
import { DialogSize } from './dialog.enum';
import { DialogButtons } from './dialog.interface';

@Component({
  selector: 'b-dialog-example',
  template: `
    <b-button (click)="openDialog1()" style="margin-right: 10px;">Time Off Policies info</b-button>
    <b-button (click)="openDialog2()">Success</b-button>
  `
})
export class DialogExampleComponent {
  private dataMock: any = {
    id: 'id_123',
    source: 'help.hibob.com',
    title: 'Time Off Policies',
    textContent: `A ‘policy’ is the a collection of rules which govern a type of leave. With bob you
can add as many holiday policies as you need for your organisation. Before we create a policy,
a note on what types are.`
  };

  constructor(
    private dialogService: DialogService,
  ) {
  }

  openDialog1(): void {
    const dialogRef: MatDialogRef<ExampleDialog1Component> = this.dialogService
      .openDialog(
        ExampleDialog1Component,
        {
          size: DialogSize.large,
          panelClass: 'dialog-example-1',
          data: this.dataMock,
        }
      );

    dialogRef.beforeClosed()
      .subscribe(res => {
        console.log('res', res);
      });
  }

  openDialog2(): void {
    const dialogRef: MatDialogRef<ExampleDialog2Component> = this.dialogService
      .openDialog(
        ExampleDialog2Component,
        {
          size: DialogSize.small,
          panelClass: 'dialog-example-2',
          data: {},
        }
      );
  }
}

@Component({
  selector: 'b-example-dialog-1',
  template: `
    <b-dialog dialogTitle="{{ data.title }}" [dialogButtons]="dialogButtonConfig">
      <div b-dialog-sub-title>
        <b-subheading style="display:inline;">The article id is {{ data.id }} </b-subheading>
      </div>
      <div b-dialog-content>
        <b-textarea label="Edit text"
                    style="width: 100%;"
                    value="{{ data.textContent }}"
                    (inputEvents)="onTextEdit($event)">
        </b-textarea>
        <article style="padding:20px; background-color:#f8f7f7; margin: 20px auto;">
          <b-big-body>"{{ editedText }}"</b-big-body>
        </article>
        <b-single-select [options]="selectOptions"
                         style="width: 100%;"
                         label="was this article helpful">
        </b-single-select>
      </div>
    </b-dialog>
  `
})
export class ExampleDialog1Component implements OnInit {

  dialogButtonConfig: DialogButtons;
  selectOptions: SelectGroupOption[];
  editedText: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit(): void {
    this.editedText = this.data.textContent;

    this.dialogButtonConfig = {
      ok: {
        label: 'Ok',
        action: () => {
          return new Promise(
            (resolve, reject) => {
              setTimeout(() => {
                resolve('Pizza');
              }, 3000);
            });
        },
      },
      cancel: {
        label: 'Cancel',
      },
      preloaderMessage: 'updating row data',
      confirmation: {
        title: 'are you sure?',
        subTitle: 'clicking confirm will invoke the method',
        buttonLabel: 'i am sure',
      }
    };

    this.selectOptions = [
      {
        groupName: 'Article interest options',
        options: [
          { id: 1, value: 'yes', selected: false, },
          { id: 2, value: 'no', selected: false, },
        ]
      }
    ];
  }

  onTextEdit(event: InputEvent): void {
    if (event.event === InputEventType.onChange) {
      this.editedText = event.value as string;
    }
  }
}

@Component({
  selector: 'b-example-dialog-2',
  template: `
    <b-dialog dialogTitle="congratulations"
              [dialogButtons]="dialogButtonConfig">
      <div b-dialog-above-header>
        <div class="success-icon"></div>
      </div>
      <div b-dialog-content>
        Alan Tulin has been successfully added to your company, check out his profile
      </div>
    </b-dialog>
  `,
  styleUrls: ['./dialog-example.scss'],
})
export class ExampleDialog2Component implements OnInit {

  dialogButtonConfig: DialogButtons;
  selectOptions: SelectGroupOption[];
  editedText: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit(): void {
    this.editedText = this.data.textContent;

    this.dialogButtonConfig = {
      ok: {
        label: 'Cool!',
        action: () => {
          return true;
        },
      },
    };
  }
}

@NgModule({
  declarations: [
    DialogExampleComponent,
    ExampleDialog1Component,
    ExampleDialog2Component,
  ],
  imports: [
    CommonModule,
    DialogModule,
    TypographyModule,
    ButtonsModule,
    FormElementsModule,
  ],
  exports: [
    DialogExampleComponent,
  ],
  entryComponents: [
    ExampleDialog1Component,
    ExampleDialog2Component,
  ],
  providers: [
    DialogService,
  ]
})
export class DialogExampleModule {
}
