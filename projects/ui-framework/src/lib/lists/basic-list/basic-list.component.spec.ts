import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { BasicListComponent } from './basic-list.component';
import { MenuComponent } from '../../navigation/menu/menu.component';
import { BodyComponent } from '../../typography/body/body.component';
import { SquareButtonComponent } from '../../buttons/square/square.component';
import { IconComponent } from '../../icons/icon.component';
import { TranslateServiceProvideMock } from '../../tests/services.stub.spec';
import { EmptyStateComponent } from '../../indicators/empty-state/empty-state.component';

describe('BasicListComponent', () => {
  let component: BasicListComponent;
  let fixture: ComponentFixture<BasicListComponent>;

  beforeEach(async(() => {
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
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
