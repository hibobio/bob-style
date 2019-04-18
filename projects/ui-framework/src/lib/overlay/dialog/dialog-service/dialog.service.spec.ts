import { TestBed } from '@angular/core/testing';
import { DialogService } from './dialog.service';
import { MatDialog } from '@angular/material';
import { Component } from '@angular/core';
import { DialogSize } from '../dialog.enum';
import { DialogConfig } from '../dialog.interface';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

@Component({
  selector: 'b-comp-mock',
  template: '<div>mock dialog component</div>'
})
export class CompMockComponent {
  constructor() {
  }
}

describe('DialogService', () => {
  let dialogService: DialogService;
  let spyMatDialog: SpyObj<MatDialog>;
  let dialogRefMock;

  const comp = CompMockComponent;
  const config: DialogConfig = {
    size: DialogSize.medium,
    panelClass: 'test-class',
    data: {},
  };

  beforeEach(() => {
    dialogRefMock = createSpyObj('dialogRefMock', ['afterClosed', 'beforeClosed']);

    spyMatDialog = createSpyObj('spyMatDialog', ['open']);
    spyMatDialog.open.and.returnValue(dialogRefMock);

    TestBed.configureTestingModule({
      providers: [
        DialogService,
        { provide: MatDialog, useValue: spyMatDialog }
      ],
    });

    dialogService = TestBed.get(DialogService);
  });

  describe('openDialog', () => {
    it('should call matDialog.open with config', () => {
      const expectedConfig = {
        size: DialogSize.medium,
        data: {},
        width: 700,
        closeOnNavigation: true,
        backdropClass: 'b-dialog-backdrop',
        panelClass: ['b-dialog-panel', 'size-medium', 'test-class'],
        hasBackdrop: true,
        disableClose: false,
      };
      dialogService.openDialog(comp, config);
      expect(spyMatDialog.open).toHaveBeenCalledWith(comp, expectedConfig);
    });
    it('should return the dialogRef object', () => {
      const dialogRef = dialogService.openDialog(comp, config);
      expect(dialogRef).toEqual(dialogRefMock);
    });
  });
});
