import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DialogComponent } from './dialog.component';
import { DialogModule } from './dialog.module';
import { MatDialogModule, MatDialogRef } from '@angular/material';
import { DialogButtons } from './dialog.interface';
import { IconService } from '../../icons/icon.service';
import { By } from '@angular/platform-browser';
import { toUpper } from 'lodash';
import { MockComponent } from 'ng-mocks';
import { ButtonComponent } from '../../buttons-indicators/buttons/button/button.component';
import { SquareButtonComponent } from '../../buttons-indicators/buttons/square/square.component';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let spyIconService: SpyObj<IconService>;
  let spyMatDialogRef: SpyObj<MatDialogRef<any>>;

  const dialogTitle = 'dialog title';

  beforeEach(async(() => {
    const dialogButtonsConfig: DialogButtons = {
      ok: {
        label: 'ok',
        action: () => {
        },
      },
      cancel: {
        label: 'cancel',
        action: () => {
        },
      },
    };

    spyIconService = createSpyObj('spyIconService', ['initIcon']);
    spyMatDialogRef = createSpyObj('spyMatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [
        MockComponent(ButtonComponent),
        MockComponent(SquareButtonComponent)
      ],
      imports: [
        NoopAnimationsModule,
        DialogModule,
        MatDialogModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: spyMatDialogRef },
        { provide: IconService, useValue: spyIconService }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DialogComponent);
        component = fixture.componentInstance;
        component.dialogTitle = dialogTitle;
        component.dialogButtons = dialogButtonsConfig;
        fixture.detectChanges();
      });
  }));

  describe('title', () => {
    it('should display component title', () => {
      const titleEl = fixture.debugElement.query(By.css('b-heading'));
      expect(titleEl.nativeElement.innerText).toEqual(toUpper(dialogTitle));
    });
  });

  describe('closeButton', () => {
    it('should invoke dialogRef.close', () => {
      const closeButton = fixture.debugElement.query(By.css('.close-button')).componentInstance;
      closeButton.clicked.emit();
      expect(spyMatDialogRef.close).toHaveBeenCalled();
    });
  });

  describe('cancelButton', () => {
    it('should invoke button config method and close panel', () => {
      spyOn(component.dialogButtons.cancel, 'action');
      const cancelButton = fixture.debugElement.query(By.css('.cancel-button'));
      cancelButton.triggerEventHandler('click', null);
      expect(component.dialogButtons.cancel.action).toHaveBeenCalled();
    });
    it('should close dialog after method is resolved',
      fakeAsync(() => {
        const cancelButton = fixture.debugElement.query(By.css('.cancel-button'));
        cancelButton.triggerEventHandler('click', null);
        tick();
        expect(spyMatDialogRef.close).toHaveBeenCalled();
      }));
    it('should close dialog immediately if no cancel action exists', () => {
      component.dialogButtons.cancel = {
        label: 'cancel',
      };
      const cancelButton = fixture.debugElement.query(By.css('.cancel-button'));
      cancelButton.triggerEventHandler('click', null);
      expect(spyMatDialogRef.close).toHaveBeenCalled();
    });
    it('should not display cancel button if does not exist', () => {
      component.dialogButtons = {
        ok: {
          label: 'ok',
          action: () => {
          },
        },
      };
      fixture.detectChanges();
      const cancelButton = fixture.debugElement.query(By.css('.cancel-button'));
      expect(cancelButton).toBeFalsy();
    });
  });

  describe('okButton', () => {
    it('should display preload message if exists', () => {
      component.dialogButtons.preloaderMessage = 'preload message';
      let progressIndicator = fixture.debugElement.query(By.css('.progress-indicator'));
      expect(progressIndicator).toBeFalsy();

      const okButton = fixture.debugElement.query(By.css('.ok-button'));
      okButton.triggerEventHandler('click', null);
      okButton.triggerEventHandler('click', null);
      fixture.detectChanges();

      progressIndicator = fixture.debugElement.query(By.css('.progress-indicator'));
      expect(progressIndicator).toBeTruthy();
      expect(progressIndicator.children[0].name).toBe('b-mini-preloader');
      expect(progressIndicator.children[1].nativeElement.innerText).toBe('preload message');
    });
    it('should not show preload message if none exists', () => {
      const okButton = fixture.debugElement.query(By.css('.ok-button'));
      okButton.triggerEventHandler('click', null);
      fixture.detectChanges();
      const progressIndicator = fixture.debugElement.query(By.css('.progress-indicator'));
      expect(progressIndicator.children.length).toBe(1);
      expect(progressIndicator.children[0].name).toBe('b-mini-preloader');
    });
    it('should invoke ok button action method', () => {
      spyOn(component.dialogButtons.ok, 'action');
      const okButton = fixture.debugElement.query(By.css('.ok-button'));
      okButton.triggerEventHandler('click', null);
      expect(component.dialogButtons.ok.action).toHaveBeenCalled();
    });
    it('should close dialog after method is resolved',
      fakeAsync(() => {
        const okButton = fixture.debugElement.query(By.css('.ok-button'));
        okButton.triggerEventHandler('click', null);
        tick();
        expect(spyMatDialogRef.close).toHaveBeenCalled();
      }));
    describe('confirmation', () => {
      beforeEach(() => {
        component.dialogButtons.confirmation = {
          buttonLabel: 'confirm',
          title: 'are you sure?',
          subTitle: 'click confirm to invoke method',
        };
      });
      it('should show confirm message if exists', () => {
        const okButton = fixture.debugElement.query(By.css('.ok-button'));
        okButton.triggerEventHandler('click', null);
        fixture.detectChanges();
        const confirmationMessage = fixture.debugElement.query(By.css('.confirmation-message'));
        expect(confirmationMessage).toBeTruthy();
        expect(confirmationMessage.children[0].nativeElement.innerText).toBe(toUpper('are you sure?'));
        expect(confirmationMessage.children[1].nativeElement.innerText).toBe('click confirm to invoke method');
      });
      it('should change ok label to the confirmation label', () => {
        const okButton = fixture.debugElement.query(By.css('.ok-button'));
        okButton.triggerEventHandler('click', null);
        fixture.detectChanges();
        const okButtonEl = fixture.debugElement.query(By.css('.ok-button'));
        expect(okButtonEl.nativeElement.innerText).toEqual('CONFIRM');
      });
      it('should remove confirmation when clicking cancel and not close dialog', () => {
        const okButton = fixture.debugElement.query(By.css('.ok-button'));
        okButton.triggerEventHandler('click', null);
        fixture.detectChanges();
        let confirmationMessage = fixture.debugElement.query(By.css('.confirmation-message'));
        expect(confirmationMessage).toBeTruthy();
        const cancelButton = fixture.debugElement.query(By.css('.cancel-button'));
        cancelButton.triggerEventHandler('click', null);
        fixture.detectChanges();
        confirmationMessage = fixture.debugElement.query(By.css('.confirmation-message'));
        expect(confirmationMessage).toBeFalsy();
        expect(spyMatDialogRef.close).not.toHaveBeenCalled();
      });
      it('should invoke ok button action method on second click', () => {
        spyOn(component.dialogButtons.ok, 'action');
        const okButton = fixture.debugElement.query(By.css('.ok-button'));
        okButton.triggerEventHandler('click', null);
        expect(component.dialogButtons.ok.action).not.toHaveBeenCalled();
        okButton.triggerEventHandler('click', null);
        expect(component.dialogButtons.ok.action).toHaveBeenCalled();
      });
      it('should close dialog after method is resolved after 2nd click',
        fakeAsync(() => {
          const okButton = fixture.debugElement.query(By.css('.ok-button'));
          okButton.triggerEventHandler('click', null);
          okButton.triggerEventHandler('click', null);
          tick();
          expect(spyMatDialogRef.close).toHaveBeenCalled();
        }));
    });
  });
});
