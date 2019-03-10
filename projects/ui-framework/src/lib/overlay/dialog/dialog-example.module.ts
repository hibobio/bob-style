import { Component, Inject, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypographyModule } from '../../typography/typography.module';
import { DialogModule } from './dialog.module';
import { DialogService } from './dialog-service/dialog.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { FormElementsModule } from '../../form-elements/form-elements.module';
import { InputEventType } from '../../form-elements/input/input.enum';
import { InputEvent } from '../../form-elements/input/input.interface';
import { SelectGroupOption } from '../../form-elements/lists/list.interface';
import { DialogSize } from './dialog.enum';
import { DialogButtons } from './dialog.interface';

@Component({
  selector: 'b-dialog-example',
  template: `
    <b-button (click)="openDialog()">Time Off Policies info</b-button>
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

  openDialog(): void {
    const dialogRef: MatDialogRef<DialogExampleDialogComponent> = this.dialogService
      .openDialog(
        DialogExampleDialogComponent,
        {
          size: DialogSize.medium,
          panelClass: 'dialog-example',
          data: this.dataMock,
        }
      );

    dialogRef.beforeClosed()
      .subscribe(res => {
        console.log('res', res);
      });
  }
}

@Component({
  selector: 'b-dialog-example-dialog',
  template: `
    <b-dialog dialogTitle="{{ data.title }}" [dialogButtons]="dialogButtonConfig">
      <div b-dialog-sub-title>
        <b-subheading style="display:inline;">The article id is {{ data.id }} </b-subheading>
        <a href="https://help.hibob.com/time-off/configuring-time-off-policies/time-off-policies"
           target="_blank">read more
        </a>
      </div>
      <div b-dialog-content>
        <b-textarea label="Edit text"
                    style="width: 100%;"
                    value="{{ data.textContent }}"
                    (inputEvents)="onTextEdit($event)">
        </b-textarea>
        <article style="padding:20px; background-color:#f8f7f7; margin: 20px auto;">
          <b-display-4>"{{ editedText }}"</b-display-4>
        </article>
        <b-single-select [options]="selectOptions"
                         style="width: 100%;"
                         label="was this article helpful">
        </b-single-select>
        <b-checkbox label="Click this"></b-checkbox>
      </div>
    </b-dialog>
  `
})
export class DialogExampleDialogComponent implements OnInit {

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
        options: [{ id: 1, value: 'yes' }, { id: 2, value: 'no' }]
      }
    ];
  }

  onTextEdit(event: InputEvent): void {
    if (event.event === InputEventType.onChange) {
      this.editedText = event.value as string;
    }
  }
}

@NgModule({
  declarations: [
    DialogExampleComponent,
    DialogExampleDialogComponent,
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
    DialogExampleDialogComponent,
  ],
  providers: [
    DialogService,
  ]
})
export class DialogExampleModule {
}
