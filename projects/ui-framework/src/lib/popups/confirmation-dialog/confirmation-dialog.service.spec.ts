import { TestBed } from '@angular/core/testing';
import { ConfirmationDialogService } from './confirmation-dialog.service';
import { DialogService } from '../dialog/dialog-service/dialog.service';
import { of } from 'rxjs';
import { ConfirmationDialogConfig } from './confirmation-dialog.interface';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { DialogSize } from '../dialog/dialog.enum';
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;

describe('ConfirmationDialogService', () => {
  let confimationDialogService: ConfirmationDialogService;
  let dialogServiceMock: SpyObj<DialogService>;
  let dialogRefMock;

  beforeEach(() => {
    dialogRefMock = createSpyObj('dialogRefMock', [
      'afterClosed',
      'beforeClosed',
    ]);
    dialogRefMock.afterClosed.and.returnValue(of({}));

    dialogServiceMock = createSpyObj('dialogServiceMock', ['openDialog']);
    dialogServiceMock.openDialog.and.returnValue(dialogRefMock);

    TestBed.configureTestingModule({
      providers: [{ provide: DialogService, useValue: dialogServiceMock }],
    });

    confimationDialogService = TestBed.inject(ConfirmationDialogService);
  });

  describe('openDialog', () => {
    it('should call dialogService.openDialog with config', () => {
      const config: ConfirmationDialogConfig = {
        title: 'test',
        class: 'confirm-test',
        buttonConfig: {
          ok: {
            label: 'Ok',
            action: () => true,
          },
        },
      };
      confimationDialogService.openDialog(config);
      expect(dialogServiceMock.openDialog).toHaveBeenCalledWith(
        ConfirmationDialogComponent,
        {
          size: DialogSize.small,
          panelClass: config.class,
          data: config,
        }
      );
    });
  });
});
