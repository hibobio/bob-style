import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniEmployeeCardComponent } from './mini-card-employee.component';
import { AvatarModule } from '../../buttons-indicators/avatar/avatar.module';
import {TypographyModule} from '../../typography/typography.module';
import {TruncateTooltipModule} from '../../services/truncate-tooltip/truncate-tooltip.module';
import {mockAvatar} from '../../mock.const';
import {By} from '@angular/platform-browser';

describe('CardProfileComponent', () => {
  let component: MiniEmployeeCardComponent;
  let fixture: ComponentFixture<MiniEmployeeCardComponent>;
  let mockComponentElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AvatarModule, TypographyModule, TruncateTooltipModule],
      declarations: [ MiniEmployeeCardComponent ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MiniEmployeeCardComponent);
        component = fixture.componentInstance;
        component.card = {
          name: 'Larry Murfiray',
          title: 'Product design',
          imageSource: mockAvatar(),
          dates: '11/07 - 20/07'
        };
        fixture.detectChanges();
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('name should be colored', () => {
    mockComponentElement = fixture.debugElement.query(
      By.css('.name')
    ).nativeElement;
    expect(getComputedStyle(mockComponentElement).color).toEqual(
      'rgb(83, 83, 83)'
    );
  });
  it('title should be colored', () => {
    mockComponentElement = fixture.debugElement.query(
      By.css('.title')
    ).nativeElement;
    expect(getComputedStyle(mockComponentElement).color).toEqual(
      'rgb(157, 157, 157)'
    );
  });
  it('dates should be colored', () => {
    mockComponentElement = fixture.debugElement.query(
      By.css('.dates')
    ).nativeElement;
    expect(getComputedStyle(mockComponentElement).color).toEqual(
      'rgb(48, 48, 48)'
    );
  });
});
