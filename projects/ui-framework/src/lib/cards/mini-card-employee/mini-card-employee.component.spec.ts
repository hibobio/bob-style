import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniEmployeeCardComponent } from './mini-card-employee.component';
import { AvatarModule } from '../../buttons-indicators/avatar/avatar.module';
import { TypographyModule } from '../../typography/typography.module';
import { TruncateTooltipModule } from '../../services/truncate-tooltip/truncate-tooltip.module';
import { mockAvatar } from '../../mock.const';
import { By } from '@angular/platform-browser';
import { AvatarComponent } from '../../buttons-indicators/avatar/avatar.component';

describe('MiniEmployeeCardComponent', () => {
  let component: MiniEmployeeCardComponent;
  let fixture: ComponentFixture<MiniEmployeeCardComponent>;
  let mockComponentElement: HTMLElement;
  let avatarComponent: AvatarComponent;
  const mockAvatarSource = mockAvatar();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AvatarModule, TypographyModule, TruncateTooltipModule],
      declarations: [MiniEmployeeCardComponent],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MiniEmployeeCardComponent);
        component = fixture.componentInstance;
        component.clickable = true;
        component.card = {
          title: 'Larry Murfiray',
          subtitle: 'Product design',
          imageSource: mockAvatarSource,
          footer: '11/07 - 20/07'
        };
        fixture.detectChanges();
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have clickable class if input of clickable is true.', () => {
    mockComponentElement = fixture.debugElement.nativeElement;
    expect(mockComponentElement.classList).toContain('clickable');
  });

  it('should have name rendered', () => {
    mockComponentElement = fixture.debugElement.query(
      By.css('.title')
    ).nativeElement;
    expect(mockComponentElement.innerText).toEqual('Larry Murfiray');
  });



  it('should have title rendered', () => {
    mockComponentElement = fixture.debugElement.query(
      By.css('.subtitle')
    ).nativeElement;
    expect(mockComponentElement.innerText).toEqual('Product design');
  });

  it('should have dates rendered', () => {
    mockComponentElement = fixture.debugElement.query(
      By.css('.footer')
    ).nativeElement;
    expect(mockComponentElement.innerText).toEqual('11/07 - 20/07');
  });

  it('should have avatar image rendered', () => {
    avatarComponent = fixture.debugElement.query(
      By.css('b-avatar')
    ).componentInstance;
    expect(avatarComponent.imageSource).toEqual(mockAvatarSource);
  });

  it('name should be colored', () => {
    mockComponentElement = fixture.debugElement.query(
      By.css('.title')
    ).nativeElement;
    expect(getComputedStyle(mockComponentElement).color).toEqual(
      'rgb(83, 83, 83)'
    );
  });
  it('title should be colored', () => {
    mockComponentElement = fixture.debugElement.query(
      By.css('.subtitle')
    ).nativeElement;
    expect(getComputedStyle(mockComponentElement).color).toEqual(
      'rgb(157, 157, 157)'
    );
  });
  it('dates should be colored', () => {
    mockComponentElement = fixture.debugElement.query(
      By.css('.footer')
    ).nativeElement;
    expect(getComputedStyle(mockComponentElement).color).toEqual(
      'rgb(48, 48, 48)'
    );
  });
});
