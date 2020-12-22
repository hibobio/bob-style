import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ListFooterComponent } from './list-footer.component';
import { MockComponent } from 'ng-mocks';
import { ButtonComponent } from '../../buttons/button/button.component';
import { IconComponent } from '../../icons/icon.component';
import { By } from '@angular/platform-browser';
import { ButtonSize, ButtonType } from '../../buttons/buttons.enum';
import { TextButtonComponent } from '../../buttons/text-button/text-button.component';
import { elementFromFixture } from '../../services/utils/test-helpers';
import { mockTranslatePipe } from '../../tests/services.stub.spec';

describe('ListFooterComponent', () => {
  let component: ListFooterComponent;
  let fixture: ComponentFixture<ListFooterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        mockTranslatePipe,
        ListFooterComponent,
        MockComponent(ButtonComponent),
        MockComponent(TextButtonComponent),
        MockComponent(IconComponent),
      ],
      providers: [],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ListFooterComponent);
        component = fixture.componentInstance;
        component.listActions = {
          clear: true,
          apply: true,
        };
        component.listActionsState = {
          clear: { disabled: false, hidden: false },
          apply: { disabled: false, hidden: false },
        };

        fixture.detectChanges();

        spyOn(component.clear, 'emit');
        spyOn(component.apply, 'emit');
      });
  }));

  describe('listActions', () => {
    describe('clear button', () => {
      let clearButton;

      beforeEach(() => {
        component.listActions = {
          clear: true,
        };
        fixture.detectChanges();
        clearButton = fixture.debugElement.query(By.css('.clear-button'));
      });

      it('should show clear with the right config', () => {
        expect(clearButton.componentInstance.text.toLowerCase()).toContain(
          'clear'
        );
      });

      it('should emit clear on clear click', () => {
        clearButton.componentInstance.clicked.emit();
        expect(component.clear.emit).toHaveBeenCalled();
      });
    });

    describe('apply button', () => {
      let applyButton;

      beforeEach(() => {
        component.listActions = {
          apply: true,
        };
        fixture.detectChanges();
        applyButton = fixture.debugElement.query(By.css('.apply-button'));
      });

      it('should show apply with the right config', () => {
        expect(applyButton.componentInstance.type).toEqual(ButtonType.primary);
        expect(applyButton.componentInstance.size).toEqual(ButtonSize.small);
        expect(applyButton.componentInstance.text.toLowerCase()).toContain(
          'apply'
        );
      });

      it('should emit apply on apply click', () => {
        applyButton.componentInstance.clicked.emit();
        expect(component.apply.emit).toHaveBeenCalled();
      });
    });

    describe('all buttons', () => {
      let clearButton;
      let applyButton;
      let footerButtons;

      beforeEach(() => {
        component.listActions = {
          clear: true,
          apply: true,
        };
        fixture.detectChanges();
        applyButton = fixture.debugElement.query(By.css('.apply-button'));
        clearButton = fixture.debugElement.query(By.css('.clear-button'));
        footerButtons = fixture.debugElement.queryAll(
          By.css('b-button,b-text-button')
        );
      });

      it('should show all buttons if passed in config', () => {
        expect(footerButtons.length).toEqual(2);
      });

      it('should set disabled state with listActionsState input', () => {
        component.listActionsState = {
          clear: { disabled: true },
          apply: { disabled: false },
        };
        fixture.detectChanges();
        expect(applyButton.componentInstance.disabled).toBeFalsy();
        expect(clearButton.componentInstance.disabled).toBeTruthy();
      });

      it('should set hide buttons with listActionsState hidden true', () => {
        component.listActionsState = {
          clear: { hidden: false },
          apply: { hidden: true },
        };
        fixture.detectChanges();

        applyButton = elementFromFixture(fixture, '.apply-button');
        clearButton = elementFromFixture(fixture, '.clear-button');

        expect(applyButton.getAttributeNames()).toContain('hidden');
        expect(clearButton.getAttributeNames()).not.toContain('hidden');
      });
    });
  });
});
