import { ComponentFixture, fakeAsync, TestBed, tick, resetFakeAsyncZone, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DialogComponent } from './dialog.component';
import { DialogModule } from './dialog.module';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DialogButtons } from './dialog.interface';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { ButtonComponent } from '../../buttons/button/button.component';
import { SquareButtonComponent } from '../../buttons/square/square.component';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { fakeAsyncFlush } from '../../services/utils/test-helpers';
import { WindowRefProvideMock } from '../../tests/services.stub.spec';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let spyMatDialogRef: SpyObj<MatDialogRef<any>>;

  const dialogTitle = 'Dialog title';

  beforeEach(() => {
    resetFakeAsyncZone();
  });

  beforeEach(waitForAsync(() => {
    const dialogButtonsConfig: DialogButtons = {
      ok: {
        label: 'ok',
        action: () => {},
      },
      cancel: {
        label: 'cancel',
        action: () => {},
      },
    };

    spyMatDialogRef = createSpyObj('spyMatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [
        MockComponent(ButtonComponent),
        MockComponent(SquareButtonComponent),
      ],
      imports: [NoopAnimationsModule, DialogModule, MatDialogModule],
      providers: [
        { provide: MatDialogRef, useValue: spyMatDialogRef },
        WindowRefProvideMock(),
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DialogComponent);
        component = fixture.componentInstance;
        component.closeModalOnHistoryBack = () => {};
        component.dialogTitle = dialogTitle;
        component.dialogButtons = dialogButtonsConfig;
      });
  }));

  describe('title', () => {
    beforeEach(() => fixture.detectChanges());
    it('should display component title', () => {
      const titleEl = fixture.debugElement.query(By.css('b-display-2'));
      expect(titleEl.nativeElement.innerText).toEqual(dialogTitle);
    });
  });

  describe('no button config', () => {
    beforeEach(() => {
      component.dialogButtons = null;
      fixture.detectChanges();
    });
    it('should not show footer', () => {
      const dialogFooter = fixture.debugElement.query(By.css('.dialog-footer'));
      expect(dialogFooter).toBeFalsy();
    });
    it('should add no-buttons class to body', () => {
      const dialogBody = fixture.debugElement.query(
        By.css('.dialog-content-wrapper')
      );
      expect(dialogBody.nativeElement.classList).toContain('no-footer');
    });
  });

  describe('closeButton', () => {
    beforeEach(() => fixture.detectChanges());
    it('should invoke dialogRef.close', () => {
      const closeButton = fixture.debugElement.query(By.css('.close-button'))
        .componentInstance;
      closeButton.clicked.emit();
      expect(spyMatDialogRef.close).toHaveBeenCalled();
    });
  });

  describe('cancelButton', () => {
    beforeEach(() => fixture.detectChanges());
    it('should invoke button config method and close panel', () => {
      spyOn(component.dialogButtons.cancel, 'action');
      const cancelButton = fixture.debugElement.query(By.css('.cancel-button'))
        .componentInstance;
      cancelButton.clicked.emit();
      expect(component.dialogButtons.cancel.action).toHaveBeenCalled();
    });
    it('should close dialog after method is resolved', fakeAsync(() => {
      const cancelButton = fixture.debugElement.query(By.css('.cancel-button'))
        .componentInstance;
      cancelButton.clicked.emit();
      tick();
      expect(spyMatDialogRef.close).toHaveBeenCalled();
      fakeAsyncFlush();
    }));
    it('should close dialog immediately if no cancel action exists', () => {
      component.dialogButtons.cancel = {
        label: 'cancel',
      };
      const cancelButton = fixture.debugElement.query(By.css('.cancel-button'))
        .componentInstance;
      cancelButton.clicked.emit();
      expect(spyMatDialogRef.close).toHaveBeenCalled();
    });
    it('should not display cancel button if does not exist', () => {
      component.dialogButtons = {
        ok: {
          label: 'ok',
          action: () => {},
        },
      };
      fixture.detectChanges();
      const cancelButton = fixture.debugElement.query(By.css('.cancel-button'));
      expect(cancelButton).toBeFalsy();
    });
  });

  describe('okButton', () => {
    beforeEach(() => fixture.detectChanges());

    it('should display preload message if exists', () => {
      component.dialogButtons.preloaderMessage = 'preload message';
      let progressIndicator = fixture.debugElement.query(
        By.css('.progress-indicator')
      );
      expect(progressIndicator).toBeFalsy();

      const okButton = fixture.debugElement.query(By.css('.ok-button'))
        .componentInstance;
      okButton.clicked.emit();
      okButton.clicked.emit();
      fixture.detectChanges();

      progressIndicator = fixture.debugElement.query(
        By.css('.progress-indicator')
      );
      expect(progressIndicator).toBeTruthy();
      expect(progressIndicator.children[0].name).toBe('b-mini-preloader');
      expect(progressIndicator.children[1].nativeElement.innerText).toBe(
        'preload message'
      );
    });

    it('should not show preload message if none exists', () => {
      const okButton = fixture.debugElement.query(By.css('.ok-button'))
        .componentInstance;
      okButton.clicked.emit();
      fixture.detectChanges();
      const progressIndicator = fixture.debugElement.query(
        By.css('.progress-indicator')
      );
      expect(progressIndicator.children.length).toBe(1);
      expect(progressIndicator.children[0].name).toBe('b-mini-preloader');
    });

    it('should invoke ok button action method', () => {
      spyOn(component.dialogButtons.ok, 'action');
      const okButton = fixture.debugElement.query(By.css('.ok-button'))
        .componentInstance;
      okButton.clicked.emit();
      expect(component.dialogButtons.ok.action).toHaveBeenCalled();
    });

    it('should close dialog after method is resolved', fakeAsync(() => {
      const okButton = fixture.debugElement.query(By.css('.ok-button'))
        .componentInstance;
      okButton.clicked.emit();
      tick();
      expect(spyMatDialogRef.close).toHaveBeenCalled();
      fakeAsyncFlush();
    }));

    it('should leave dialog open if action resolves false', () => {
      fakeAsync(() => {
        let closeButton;
        const okButton = fixture.debugElement.query(By.css('.ok-button'))
          .componentInstance;
        let progressIndicator;
        component.dialogButtons.ok.action = () => false;
        okButton.clicked.emit();
        fixture.detectChanges();
        progressIndicator = fixture.debugElement.query(
          By.css('.progress-indicator')
        );
        expect(progressIndicator.children.length).toBe(1);
        closeButton = fixture.debugElement.query(By.css('.close-button'))
          .componentInstance;
        expect(closeButton.nativeElement).toBeTruthy();
        tick();
        expect(spyMatDialogRef.close).not.toHaveBeenCalled();
        progressIndicator = fixture.debugElement.query(
          By.css('.progress-indicator')
        );
        expect(progressIndicator).toBeFalsy();
        fakeAsyncFlush();
      });
    });

    describe('confirmation', () => {
      beforeEach(() => {
        component.dialogButtons.confirmation = {
          buttonLabel: 'confirm',
          title: 'are you sure?',
          subTitle: 'click confirm to invoke method',
        };
      });

      it('should show confirm message if exists', () => {
        const okButton = fixture.debugElement.query(By.css('.ok-button'))
          .componentInstance;
        okButton.clicked.emit();
        fixture.detectChanges();
        const confirmationMessage = fixture.debugElement.query(
          By.css('.confirmation-message')
        );
        expect(confirmationMessage).toBeTruthy();
        expect(confirmationMessage.children[0].nativeElement.innerText).toBe(
          'are you sure?'
        );
        expect(confirmationMessage.children[1].nativeElement.innerText).toBe(
          'click confirm to invoke method'
        );
      });

      it('should change ok label to the confirmation label', () => {
        const okButton = fixture.debugElement.query(By.css('.ok-button'))
          .componentInstance;
        okButton.clicked.emit();
        fixture.detectChanges();
        const okButtonEl = fixture.debugElement.query(By.css('.ok-button'));
        expect(okButtonEl.nativeElement.innerText).toContain('confirm');
      });

      it('should remove confirmation when clicking cancel and not close dialog', fakeAsync(() => {
        const okButton = fixture.debugElement.query(By.css('.ok-button'))
          .componentInstance;
        okButton.clicked.emit();
        fixture.detectChanges();
        let confirmationMessage = fixture.debugElement.query(
          By.css('.confirmation-message')
        );
        expect(confirmationMessage).toBeTruthy();
        const cancelButton = fixture.debugElement.query(
          By.css('.cancel-button')
        ).componentInstance;
        cancelButton.clicked.emit();
        fixture.detectChanges();
        tick(1000);
        confirmationMessage = fixture.debugElement.query(
          By.css('.confirmation-message')
        );
        expect(confirmationMessage).toBeFalsy();
        expect(spyMatDialogRef.close).not.toHaveBeenCalled();
      }));

      it('should invoke ok button action method on second click', () => {
        spyOn(component.dialogButtons.ok, 'action');
        const okButton = fixture.debugElement.query(By.css('.ok-button'))
          .componentInstance;
        okButton.clicked.emit();
        expect(component.dialogButtons.ok.action).not.toHaveBeenCalled();
        okButton.clicked.emit();
        expect(component.dialogButtons.ok.action).toHaveBeenCalled();
      });

      it('should close dialog after method is resolved after 2nd click', fakeAsync(() => {
        const okButton = fixture.debugElement.query(By.css('.ok-button'))
          .componentInstance;
        okButton.clicked.emit();
        okButton.clicked.emit();
        tick();
        expect(spyMatDialogRef.close).toHaveBeenCalled();
        fakeAsyncFlush();
      }));

      it('should disable ok button if configured to be disabled', () => {
        component.dialogButtons = {
          ok: {
            label: 'ok',
            action: () => {},
            disabled: true,
          },
        };
        fixture.detectChanges();
        const okButton = fixture.debugElement.query(By.css('.ok-button'))
          .componentInstance;
        expect(okButton.disabled).toBeTruthy();
      });
    });
  });

  describe('extras', () => {
    it('should not call button action if someone subscribed to button events ouputs', () => {
      component.clickedOK.subscribe(() => {});
      fixture.detectChanges();
      spyOn(component.dialogButtons.ok, 'action');

      const okButton = fixture.debugElement.query(By.css('.ok-button'))
        .componentInstance;
      okButton.clicked.emit();

      expect(component.dialogButtons.ok.action).not.toHaveBeenCalled();
      component.clickedOK.complete();
    });

    it('should close dialog if closeDialog input is set to true', () => {
      component.doCloseDialog = true;
      fixture.detectChanges();

      expect(spyMatDialogRef.close).toHaveBeenCalledTimes(1);
    });

    it('should not change showConfirmation on actions, if showConfirmation input has a boolean value', () => {
      component.dialogButtons.confirmation = {
        title: 'are you sure?',
      };
      component.setConfirmationControl = false;
      fixture.detectChanges();

      expect(component.showConfirmation).toEqual(false);

      const okButton = fixture.debugElement.query(By.css('.ok-button'))
        .componentInstance;
      okButton.clicked.emit();
      fixture.detectChanges();

      const confirmationMessage = fixture.debugElement.query(
        By.css('.confirmation-message')
      );
      expect(confirmationMessage).toBeFalsy();
      expect(component.showConfirmation).toEqual(false);
    });
  });

  describe('OnDestroy', () => {
    it('should invoke close on dialogRef', () => {
      component.ngOnDestroy();
      expect(spyMatDialogRef.close).toHaveBeenCalledTimes(1);
    });
  });
});
