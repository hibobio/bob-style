import { TestBed } from '@angular/core/testing';
import { DialogService } from './dialog.service';
import { MatDialog } from '@angular/material';
import { Component } from '@angular/core';
import { DialogSize } from './dialog.enum';
import { DialogConfig } from './dialog.interface';
import { of } from 'rxjs';
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

  beforeEach(() => {
    const dialogRefMock = createSpyObj('dialogRefMock', ['afterClosed']);
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
    it('should call matDialog.open with config', () => {
      const comp = CompMockComponent;
      const config: DialogConfig = {
        size: DialogSize.medium,
        panelClass: 'test-class',
        data: {},
      };
      dialogService.openDialog(comp, config);
      expect(spyMatDialog.open).toHaveBeenCalledWith(comp, config);
    });
  });
});
