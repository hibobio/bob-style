import { TestBed } from '@angular/core/testing';
import { DialogService } from './dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { DialogSize } from '../dialog.enum';
import { DialogConfig } from '../dialog.interface';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { of } from 'rxjs';

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
  let config: DialogConfig;

  beforeEach(() => {
    config = {
      size: DialogSize.medium,
      panelClass: 'test-class',
      data: {},
    };

    dialogRefMock = createSpyObj('dialogRefMock', ['afterClosed', 'beforeClosed']);
    dialogRefMock.afterClosed.and.returnValue(of({}));

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
    it('should call matDialog.open with config small', () => {
      config = {
        size: DialogSize.small,
        panelClass: 'test-class',
        data: {},
      };
      const expectedConfig = {
        size: DialogSize.small,
        data: {},
        width: 480,
        closeOnNavigation: true,
        backdropClass: 'b-dialog-backdrop',
        panelClass: ['b-dialog-panel', 'size-small', 'test-class'],
        hasBackdrop: true,
        disableClose: false,
        maxWidth: '90vw',
      };
      dialogService.openDialog(comp, config);
      expect(spyMatDialog.open).toHaveBeenCalledWith(comp, expectedConfig);
    });
    it('should call matDialog.open with config medium', () => {
      config = {
        size: DialogSize.medium,
        panelClass: 'test-class',
        data: {},
      };
      const expectedConfig = {
        size: DialogSize.medium,
        data: {},
        width: 720,
        closeOnNavigation: true,
        backdropClass: 'b-dialog-backdrop',
        panelClass: ['b-dialog-panel', 'size-medium', 'test-class'],
        hasBackdrop: true,
        disableClose: false,
        maxWidth: '90vw',
      };
      dialogService.openDialog(comp, config);
      expect(spyMatDialog.open).toHaveBeenCalledWith(comp, expectedConfig);
    });
    it('should call matDialog.open with config large', () => {
      config = {
        size: DialogSize.large,
        panelClass: 'test-class',
        data: {},
      };
      const expectedConfig = {
        size: DialogSize.large,
        data: {},
        width: 960,
        closeOnNavigation: true,
        backdropClass: 'b-dialog-backdrop',
        panelClass: ['b-dialog-panel', 'size-large', 'test-class'],
        hasBackdrop: true,
        disableClose: false,
        maxWidth: '90vw',
      };
      dialogService.openDialog(comp, config);
      expect(spyMatDialog.open).toHaveBeenCalledWith(comp, expectedConfig);
    });
    it('should return the dialogRef object', () => {
      const dialogRef = dialogService.openDialog(comp, config);
      expect(dialogRef).toEqual(dialogRefMock);
    });
    it('should subscribe to afterClosed event', () => {
      dialogService.openDialog(comp, config);
      expect(dialogRefMock.afterClosed).toHaveBeenCalled();
    });
  });
});
