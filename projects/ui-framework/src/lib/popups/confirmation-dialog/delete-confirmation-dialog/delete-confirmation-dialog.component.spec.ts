import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DialogComponent } from '../../dialog/dialog.component';
import { By } from '@angular/platform-browser';
import { ConfirmationDialogConfig } from '../confirmation-dialog.interface';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog.component';
import { ButtonType } from '../../.././buttons/buttons.enum';
import { mockTranslatePipe, TranslateServiceProvideMock } from '../../../tests/services.stub.spec';
import { InputComponent } from '../../../form-elements/input/input.component';

describe('DeleteConfirmationDialogComponent', () => {
  let component: DeleteConfirmationDialogComponent;
  let fixture: ComponentFixture<DeleteConfirmationDialogComponent>;
  let spyMatDialogRef: SpyObj<MatDialogRef<any>>;
  let config: ConfirmationDialogConfig;

  beforeEach(async(() => {
    spyMatDialogRef = createSpyObj('spyMatDialogRef', ['close']);

    config = {
      title: 'Confirm dialog title',
      class: 'confirm-test',
      buttonConfig: {
        ok: {
          label: 'translated common.delete',
          action: () => true,
        },
        cancel: {
          label: 'translated common.cancel'
        }
      },
      confirmationData: {
        confirmationText: 'test',
        label: 'delete confirmation test',
        errorMessage: 'error message'
      },
      message: 'Confirm dialog message',
    };

    TestBed.configureTestingModule({
      declarations: [
        DeleteConfirmationDialogComponent,
        MockComponent(DialogComponent),
        MockComponent(InputComponent),
        mockTranslatePipe
      ],
      imports: [NoopAnimationsModule, MatDialogModule],
      providers: [
        { provide: MatDialogRef, useValue: spyMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: config },
        TranslateServiceProvideMock()
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DeleteConfirmationDialogComponent);
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
      const bConfig = {
        cancel: {
          label: 'translated common.cancel'
        },
        ok: Object.assign({}, config.buttonConfig.ok, {
          disabled: true,
          type: ButtonType.negative,
          action: jasmine.any(Function)
        })
      };
      expect(dialog.componentInstance.dialogButtons).toEqual(bConfig);
    });
    it('should render message', () => {
      const message = fixture.debugElement.query(By.css('.message'));
      expect(message.nativeElement.innerText).toContain(
        'Confirm dialog message'
      );
    });
    it ('should show confirmation text input with label', () => {
      const input = fixture.debugElement.query(By.css('b-input'));
      expect(input.context.label).toEqual('delete confirmation test');
    });
    it('should show error msg', (done) => {
      const input = fixture.debugElement.query(By.css('b-input'));
      input.context.value = 'asd';
      const event = {
        value: 'asd'
      };
      component.valid$.subscribe(valid => {
        expect(valid).toBeFalse();
        done();
      });
      input.componentInstance.changed.emit(event);
    });

    it('should not show error msg', (done) => {
      const input = fixture.debugElement.query(By.css('b-input'));
      input.context.value = 'test';
      const event = {
        value: 'test'
      };
      component.valid$.subscribe(valid => {
        expect(valid).toBeTrue();
        done();
      });
      input.componentInstance.changed.emit(event);
    });
  });

  describe('OnDestroy', () => {
    it('should invoke close on dialogRef', () => {
      component.ngOnDestroy();
      expect(spyMatDialogRef.close).toHaveBeenCalledTimes(1);
    });
  });
});
