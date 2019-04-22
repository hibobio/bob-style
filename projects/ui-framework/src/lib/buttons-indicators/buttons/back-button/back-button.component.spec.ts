import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BackButtonComponent } from './back-button.component';
import { ButtonComponent } from '../button/button.component';
import { MockComponent } from 'ng-mocks';
import { By } from '@angular/platform-browser';
import { Icons } from '../../../icons/icons.enum';
import { BackButtonType } from '../buttons.enum';

describe('BackButtonComponent', () => {
  let component: BackButtonComponent;
  let fixture: ComponentFixture<BackButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent(ButtonComponent),
        BackButtonComponent,
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(BackButtonComponent);
        component = fixture.componentInstance;
        spyOn(component.clicked, 'emit');
      });
  }));

  it('should show button component with back icon and button size small', () => {
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('b-button'));
    expect(button.componentInstance.icon).toEqual(Icons.back_arrow_link);
    expect(button.componentInstance.size).toEqual('small');
  });

  it('should emit onclick when regular button emits onclick', () => {
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('b-button'));
    button.context.clicked.emit();
    expect(component.clicked.emit).toHaveBeenCalledTimes(1);
  });

  it('should not set button as disabled by default', () => {
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('b-button'));
    expect(button.componentInstance.disabled).toBe(false);
  });

  it('should set button as disabled', () => {
    component.disabled = true;
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('b-button'));
    expect(button.componentInstance.disabled).toBe(true);
  });

  it('should set button type as secondary by default', () => {
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('b-button'));
    expect(button.componentInstance.type).toBe(BackButtonType.secondary);
  });

  it('should set button type as tertiary', () => {
    component.type = BackButtonType.tertiary;
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('b-button'));
    expect(button.componentInstance.type).toBe(BackButtonType.tertiary);
  });

});
