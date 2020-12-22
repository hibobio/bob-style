import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { MockComponent } from 'ng-mocks';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DialogComponent } from '../dialog/dialog.component';
import { By } from '@angular/platform-browser';
import { ConfirmationDialogConfig } from './confirmation-dialog.interface';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;
  let spyMatDialogRef: SpyObj<MatDialogRef<any>>;
  let config: ConfirmationDialogConfig;

  beforeEach(waitForAsync(() => {
    spyMatDialogRef = createSpyObj('spyMatDialogRef', ['close']);

    config = {
      title: 'Confirm dialog title',
      class: 'confirm-test',
      buttonConfig: {
        ok: {
          label: 'Ok',
          action: () => true,
        },
      },
      message: 'Confirm dialog message',
    };

    TestBed.configureTestingModule({
      declarations: [
        ConfirmationDialogComponent,
        MockComponent(DialogComponent),
      ],
      imports: [NoopAnimationsModule, MatDialogModule],
      providers: [
        { provide: MatDialogRef, useValue: spyMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: config },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ConfirmationDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  describe('config', () => {
    it('should set dialog title', () => {
      const dialog = fixture.debugElement.query(By.css('b-dialog'));
      expect(dialog.componentInstance.dialogTitle).toEqual(
        'Confirm dialog title'
      );
    });
    it('should set dialog buttonConfig', () => {
      const dialog = fixture.debugElement.query(By.css('b-dialog'));
      expect(dialog.componentInstance.dialogButtons).toEqual(
        config.buttonConfig
      );
    });
    it('should render message', () => {
      const message = fixture.debugElement.query(By.css('.message'));
      expect(message.nativeElement.innerText).toContain(
        'Confirm dialog message'
      );
    });
  });

  describe('OnDestroy', () => {
    it('should invoke close on dialogRef', () => {
      component.ngOnDestroy();
      expect(spyMatDialogRef.close).toHaveBeenCalledTimes(1);
    });
  });
});
