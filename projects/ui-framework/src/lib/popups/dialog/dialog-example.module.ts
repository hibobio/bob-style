import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, Input, NgModule, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ButtonType } from '../../buttons/buttons.enum';
import { ButtonsModule } from '../../buttons/buttons.module';
import { InputEventType } from '../../form-elements/form-elements.enum';
import { FormElementsModule } from '../../form-elements/form-elements.module';
import { BInputEvent } from '../../form-elements/input/input.interface';
import { SelectGroupOption } from '../../lists/list.interface';
import { TypographyModule } from '../../typography/typography.module';
import { DialogService } from './dialog-service/dialog.service';
import { DialogSize } from './dialog.enum';
import { DialogButtons } from './dialog.interface';
import { DialogModule } from './dialog.module';

@Component({
  selector: 'b-dialog-example',
  template: `
    <b-button (clicked)="openDialog1()" style="margin: 5px;">Time Off Policies info </b-button>
    <b-button (clicked)="openDialog2()" style="margin: 5px;">Success</b-button>
    <b-button (clicked)="openDialog3()" style="margin: 5px;">$$$</b-button>
  `,
})
export class DialogExampleComponent {
  private dataMock: any = {
    id: 'id_123',
    source: 'help.hibob.com',
    title: 'Time Off Policies',
    textContent: `A ‘policy’ is the a collection of rules which govern a type of leave. With bob you
can add as many holiday policies as you need for your organisation. Before we create a policy,
a note on what types are.`,
  };

  @Input() size: DialogSize;
  @Input() disableClose = false;
  @Input() closeOnBackdropClick = false;

  constructor(private dialogService: DialogService) {}

  openDialog1(): void {
    const dialogRef: MatDialogRef<ExampleDialog1Component> = this.dialogService.openDialog(
      // tslint:disable-next-line: no-use-before-declare
      ExampleDialog1Component,
      {
        size: this.size || DialogSize.medium,
        panelClass: 'dialog-example-1',
        data: this.dataMock,
        disableClose: this.disableClose,
        closeOnBackdropClick: this.closeOnBackdropClick,
      }
    );

    dialogRef.beforeClosed().subscribe((res) => {
      console.log('res', res);
    });
  }

  openDialog2(): void {
    const dialogRef: MatDialogRef<ExampleDialog2Component> = this.dialogService.openDialog(
      // tslint:disable-next-line: no-use-before-declare
      ExampleDialog2Component,
      {
        size: this.size || DialogSize.small,
        panelClass: 'dialog-example-2',
        data: {},
        disableClose: this.disableClose,
        closeOnBackdropClick: this.closeOnBackdropClick,
      }
    );
  }

  openDialog3(): void {
    const dialogRef: MatDialogRef<ExampleDialog2Component> = this.dialogService.openDialog(
      // tslint:disable-next-line: no-use-before-declare
      ExampleDialog3Component,
      {
        size: this.size || DialogSize.medium,
        panelClass: 'dialog-example-3',
        data: {
          title: 'New world order',
        },
        disableClose: this.disableClose,
        closeOnBackdropClick: this.closeOnBackdropClick,
      }
    );
  }
}

@Component({
  selector: 'b-example-dialog-1',
  template: `
    <b-dialog dialogTitle="{{ data.title }}" [dialogButtons]="dialogButtonConfig">
      <div b-dialog-sub-title>
        <b-subheading style="display:inline;"> The article id is {{ data.id }} </b-subheading>
      </div>
      <div b-dialog-content>
        <b-textarea
          label="Edit text"
          style="width: 100%;"
          value="{{ data.textContent }}"
          (inputEvents)="onTextEdit($event)"
        >
        </b-textarea>
        <article style="padding:20px; background-color:#f8f7f7; margin: 20px auto;">
          <b-big-body>"{{ editedText }}"</b-big-body>
        </article>
        <b-single-select [options]="selectOptions" style="width: 100%;" label="was this article helpful">
        </b-single-select>
      </div>
      <b-checkbox mat-dialog-footer-left label="Auto approve on request"></b-checkbox>
      <div b-dialog-confirmation>*here you can add confirmation template*</div>
    </b-dialog>
  `,
})
export class ExampleDialog1Component implements OnInit {
  dialogButtonConfig: DialogButtons;
  selectOptions: SelectGroupOption[];
  editedText: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.editedText = this.data.textContent;

    this.dialogButtonConfig = {
      ok: {
        label: 'Ok',
        class: 'ok-button-666',
        action: () => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve('Pizza');
            }, 3000);
          });
        },
      },
      cancel: {
        label: 'Cancel',
        class: 'cancel-button-666',
      },
      preloaderMessage: 'updating row data',
      confirmation: {
        title: 'are you sure?',
        subTitle: 'clicking confirm will invoke the method',
        buttonLabel: 'i am sure',
      },
    };

    this.selectOptions = [
      {
        groupName: 'Article interest options',
        options: [
          { id: 1, value: 'yes', selected: false },
          { id: 2, value: 'no', selected: false },
        ],
      },
    ];
  }

  onTextEdit(event: BInputEvent<string>): void {
    if (event.event === InputEventType.onChange) {
      this.editedText = event.value as string;
    }
  }
}

@Component({
  selector: 'b-example-dialog-2',
  template: `
    <b-dialog dialogTitle="congratulations" [dialogButtons]="dialogButtonConfig">
      <div b-dialog-above-header>
        <div class="success-icon b-icon-success-alt"></div>
      </div>
      <div b-dialog-content>
        Alan Tulin has been successfully added to your company, check out his profile
      </div>
    </b-dialog>
  `,
  styles: [
    `
      .success-icon:before {
        width: 40px;
        height: 40px;
        font-size: 40px;
        line-height: 40px;
        color: var(--primary-500);
        border-radius: 100%;
        margin-bottom: 5px;
        position: relative;
      }
    `,
  ],
})
export class ExampleDialog2Component implements OnInit {
  dialogButtonConfig: DialogButtons;
  selectOptions: SelectGroupOption[];
  editedText: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

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

const bgsvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' style='height: 100%25;' %3E%3Cpath d='M240.62 4.854h30.754V82.76H240.62zM120.33 67.415l21.747-21.746 55.086 55.087-21.746 21.746zM79.52 165.959h77.907v30.754H79.52zM354.574 165.959h77.906v30.754h-77.906zM314.83 100.766l55.087-55.087 21.746 21.746-55.087 55.088zM476.612 451.77H35.388L0 507.146h512zM366.531 279.51H145.469l-35.388 55.376h291.838zM421.572 365.64H90.428l-35.387 55.376h401.918zM311.491 193.381H200.509l-35.387 55.375h181.756zM256.45 107.251h-.9l-35.388 55.376h71.676z' /%3E%3C/svg %3E")`;

@Component({
  selector: 'b-example-dialog-3',
  template: `
    <b-dialog
      [dialogTitle]="data.title"
      [dialogButtons]="dialogButtonConfig"
      [showProgress]="showProgress"
      [showConfirmation]="showConfirmation"
      [closeDialog]="closeDialog"
      (clickedCancel)="cancel()"
    >
      <div b-dialog-content>
        <span class="magic magic1"><span class="magic magic2"></span></span>
      </div>
      <div b-dialog-confirmation>
        You can: <br />
        <b-button size="small" type="primary" (clicked)="obey()">Obey</b-button>
        <b-button size="small" type="negative" (clicked)="resist()">Resist</b-button>
      </div>
      <div class="b-display-4" b-dialog-preloader-message [innerHTML]="preloaderMessage"></div>
    </b-dialog>
  `,
  styles: [
    `
      @keyframes rainbow {
        0% {
          background-position: 0% 82%;
        }
        50% {
          background-position: 100% 19%;
        }
        100% {
          background-position: 0% 82%;
        }
      }

      .magic {
        display: block;
        width: 300px;
        height: 300px;
      }

      .magic1 {
        background: ${bgsvg};
        background-size: cover;
        margin: 20px;
      }

      .magic2 {
        background: linear-gradient(124deg, #490f2d, #470f7f, #714467, #bf208e, #76003d, #12005f, #d3004e, #192114);
        background-size: 1800% 1800%;
        animation: rainbow 10s ease infinite;
        mask-image: ${bgsvg};
        -webkit-mask-image: ${bgsvg};
        -webkit-mask-size: contain;
        mask-size: contain;
        transition: opacity 1s;
        opacity: 0;
        will-change: opacity;
      }

      .magic2:hover {
        opacity: 1;
      }
    `,
    ':host ::ng-deep [b-dialog-content] { display: flex; justify-content: center; }',
    ':host ::ng-deep div { text-align: center; }',
    'b-button { margin: 5px; }',
    ':host ::ng-deep .action-buttons { margin:auto; }',
    ':host ::ng-deep p { margin-bottom: 0; }',
  ],
})
export class ExampleDialog3Component implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private cd: ChangeDetectorRef) {}

  public dialogButtonConfig: DialogButtons;

  public showProgress: boolean;
  public showConfirmation: boolean;
  public closeDialog: boolean;

  public preloaderMessage: string;

  private timeoutID;

  ngOnInit(): void {
    this.dialogButtonConfig = {
      ok: {
        label: 'Engage',
        action: () => {
          this.ok();
          return Promise.resolve(false);
        },
      },
      cancel: {
        label: 'Hide',
        type: ButtonType.negative,
      },
      preloaderMessage: 'A wise man said...',
    };
  }

  obey() {
    this.preloaderMessage = `<p>Obedience leads to true freedom</p>
    <em class="b-big-body">—James E. Faust</em>`;
    this.showProgress = true;
    this.showConfirmation = false;

    window.clearTimeout(this.timeoutID);
    this.timeoutID = window.setTimeout(() => {
      this.closeDialog = true;
      this.cd.detectChanges();
    }, 4000);
  }

  resist() {
    this.preloaderMessage = `<p>The history of liberty is a history of resistance</p>
    <em class="b-big-body">Woodrow Wilson</em>`;
    this.showProgress = true;
    this.showConfirmation = false;

    window.clearTimeout(this.timeoutID);
    this.timeoutID = window.setTimeout(() => {
      this.closeDialog = true;
      this.cd.detectChanges();
    }, 4000);
  }

  ok() {
    this.showConfirmation = true;
  }

  cancel() {
    this.closeDialog = true;
    this.cd.detectChanges();
  }
}

@NgModule({
  declarations: [DialogExampleComponent, ExampleDialog1Component, ExampleDialog2Component, ExampleDialog3Component],
  imports: [CommonModule, DialogModule, TypographyModule, ButtonsModule, FormElementsModule],
  exports: [DialogExampleComponent],
  entryComponents: [ExampleDialog1Component, ExampleDialog2Component, ExampleDialog3Component],
  providers: [DialogService],
})
export class DialogExampleModule {}
