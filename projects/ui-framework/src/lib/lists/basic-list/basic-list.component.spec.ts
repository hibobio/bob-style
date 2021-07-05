import { MockComponent } from 'ng-mocks';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SquareButtonComponent } from '../../buttons/square/square.component';
import { IconComponent } from '../../icons/icon.component';
import { EmptyStateComponent } from '../../indicators/empty-state/empty-state.component';
import { MenuComponent } from '../../navigation/menu/menu.component';
import { TranslateServiceProvideMock } from '../../tests/services.stub.spec';
import { BodyComponent } from '../../typography/body/body.component';
import { BasicListComponent } from './basic-list.component';

describe('BasicListComponent', () => {
  let component: BasicListComponent;
  let fixture: ComponentFixture<BasicListComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          BasicListComponent,
          MockComponent(IconComponent),
          MockComponent(BodyComponent),
          MockComponent(MenuComponent),
          MockComponent(SquareButtonComponent),
          MockComponent(EmptyStateComponent),
        ],
        providers: [TranslateServiceProvideMock()],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
