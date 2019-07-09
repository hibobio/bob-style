import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniEmployeeCardComponent } from './mini-card-employee.component';
import { AvatarModule } from '../../buttons-indicators/avatar/avatar.module';
import {TypographyModule} from '../../typography/typography.module';
import {TruncateTooltipModule} from '../../services/truncate-tooltip/truncate-tooltip.module';
import {mockAvatar} from '../../mock.const';

describe('CardProfileComponent', () => {
  let component: MiniEmployeeCardComponent;
  let fixture: ComponentFixture<MiniEmployeeCardComponent>;

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
});
