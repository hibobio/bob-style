import { Component, Inject, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypographyModule } from '../../typography/typography.module';
import { DialogModule } from './dialog.module';
import { DialogService } from './dialog.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { FormElementsModule } from '../../form-elements/form-elements.module';
import { SelectGroupOption } from '../../form-elements/select/select.interface';
import { InputEvent, InputEventType } from '../../form-elements/input';

@Component({
  selector: 'b-dialog-example',
  template: `
    <b-button (click)="openDialog()">open Syria</b-button>
  `,
})
export class DialogExampleComponent {

  private dataMock: any = {
    id: 'id_123',
    source: 'Wikipedia',
    title: 'Syria (سوريا‎)',
    textContent: `Syria (Arabic: سوريا‎ Sūriyā), officially the Syrian Arab Republic
    (Arabic: الجمهورية العربية السورية‎ al-Jumhūrīyah al-ʻArabīyah as-Sūrīyah), is a
    country in Western Asia, bordering Lebanon and the Mediterranean Sea to the west,
    Turkey to the north, Iraq to the east, Jordan to the south, and Israel to the southwest.`,
  };

  constructor(
    private dialogService: DialogService,
  ) {
  }

  openDialog(): void {
    this.dialogService.openDialog(DialogExampleDialogComponent, {
      width: '800px',
      data: this.dataMock,
    });
  }
}

@Component({
  selector: 'b-dialog-example-dialog',
  template: `
    <b-dialog
      dialogTitle="{{data.title}}"
      [dialogButtonConfig]="dialogButtonConfig">
      <div b-dialog-sub-title>
        <b-subheading style="display:inline;">The article id is {{data.id}} </b-subheading>
        <a href="https://en.wikipedia.org/wiki/Syria" target="_blank">read more</a>
      </div>
      <div b-dialog-content>
        <b-textarea label="Edit text"
                    style="width: 100%;"
                    value="{{data.textContent}}"
                    (inputEvents)="onTextEdit($event)">
        </b-textarea>
        <article style="padding:20px; background-color:#f8f7f7; margin: 20px auto;">
          <b-display-4>"{{editedText}}"</b-display-4>
        </article>
        <b-single-select [options]="selectOptions"
                         style="width: 100%;"
                         label="was this article helpfull">
        </b-single-select>
        <b-checkbox label="Click this"></b-checkbox>
      </div>
    </b-dialog>
  `,
})
export class DialogExampleDialogComponent implements OnInit {

  dialogButtonConfig: any;
  selectOptions: SelectGroupOption[];
  editedText: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit(): void {
    this.editedText = this.data.textContent;
    this.dialogButtonConfig = {
      okLabel: 'Ok',
      cancelLabel: 'cancel',
    };
    this.selectOptions = [
      {
        groupName: 'Article interest options',
        options: [
          { id: 1, value: 'yes' },
          { id: 2, value: 'no' },
        ],
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
  ],
})
export class DialogExampleModule {
}
