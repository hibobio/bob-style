import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { SwitchToggleComponent } from './switch-toggle.component';

describe('SwitchToggleComponent', () => {
  let component: SwitchToggleComponent;
  let fixture: ComponentFixture<SwitchToggleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SwitchToggleComponent],
      imports: [MatSlideToggleModule],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SwitchToggleComponent);
        component = fixture.componentInstance;
        component.switchChange.subscribe(() => {});
        spyOn(component.switchChange, 'emit');
        fixture.detectChanges();
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('Should call changed callback', () => {
    component.switchChange.subscribe(() => {});
    component.onChange({ checked: true } as MatSlideToggleChange);
    expect(component.switchChange.emit).toHaveBeenCalled();
    component.switchChange.unsubscribe();
  });
});
