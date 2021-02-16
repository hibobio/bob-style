import { TestBed } from '@angular/core/testing';
import { DialogService } from './dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { DialogSize } from '../dialog.enum';
import { DialogConfig } from '../dialog.interface';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { of } from 'rxjs';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import { DIALOG_CONFIG_DEF } from '../dialog.const';
import { omit } from '../../../services/utils/functional-utils';

@Component({
  selector: 'b-comp-mock',
  template: '<div>mock dialog component</div>',
})
export class CompMockComponent {
  constructor() {}
}

describe('DialogService', () => {
  let dialogService: DialogService;
  let spyMatDialog: SpyObj<MatDialog>;
  let dialogRefMock;

  const comp = CompMockComponent;
  let config: DialogConfig;

  DOMhelpers.prototype.injectStyles(`
    .html-reporter .result-message {
      white-space: pre-line !important;
      margin-bottom: 14px;
      line-height: 2;
      max-width: 700px;
    }
    .html-reporter .stack-trace {
      white-space: pre-line !important;
    }
  `);

  beforeEach(() => {
    config = {
      size: DialogSize.medium,
      panelClass: 'test-class',
      data: {},
    };

    dialogRefMock = createSpyObj('dialogRefMock', [
      'afterClosed',
      'beforeClosed',
    ]);
    dialogRefMock.afterClosed.and.returnValue(of({}));

    spyMatDialog = createSpyObj('spyMatDialog', ['open']);
    spyMatDialog.open.and.returnValue(dialogRefMock);

    TestBed.configureTestingModule({
      providers: [
        DialogService,
        { provide: MatDialog, useValue: spyMatDialog },
      ],
    });

    dialogService = TestBed.inject(DialogService);
  });

  describe('openDialog', () => {
    it('should call matDialog.open with config small', () => {
      config = {
        size: DialogSize.small,
        panelClass: 'test-class',
        data: {},
      };

      const expectedConfig = {
        ...omit(DIALOG_CONFIG_DEF, 'disableClose'),
        size: DialogSize.small,
        data: {},
        width: '480px',
        panelClass: ['b-dialog-panel', 'size-small', 'test-class'],
      };

      dialogService.openDialog(comp, config);
      expect(spyMatDialog.open).toHaveBeenCalledWith(
        comp,
        jasmine.objectContaining(expectedConfig)
      );
    });
    it('should call matDialog.open with config medium', () => {
      config = {
        size: DialogSize.medium,
        panelClass: 'test-class',
        data: {},
      };

      const expectedConfig = {
        ...omit(DIALOG_CONFIG_DEF, 'disableClose'),
        size: DialogSize.medium,
        data: {},
        width: '720px',
        panelClass: ['b-dialog-panel', 'size-medium', 'test-class'],
      };

      dialogService.openDialog(comp, config);
      expect(spyMatDialog.open).toHaveBeenCalledWith(
        comp,
        jasmine.objectContaining(expectedConfig)
      );
    });
    it('should call matDialog.open with config large', () => {
      config = {
        size: DialogSize.large,
        panelClass: 'test-class',
        data: {},
      };

      const expectedConfig = {
        ...omit(DIALOG_CONFIG_DEF, 'disableClose'),
        size: DialogSize.large,
        data: {},
        width: '960px',
        panelClass: ['b-dialog-panel', 'size-large', 'test-class'],
      };

      dialogService.openDialog(comp, config);
      expect(spyMatDialog.open).toHaveBeenCalledWith(
        comp,
        jasmine.objectContaining(expectedConfig)
      );
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
