import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardProfileComponent } from './card-profile.component';
import { AvatarModule } from '../../buttons-indicators/avatar/avatar.module';

describe('CardProfileComponent', () => {
  let component: CardProfileComponent;
  let fixture: ComponentFixture<CardProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AvatarModule],
      declarations: [ CardProfileComponent ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CardProfileComponent);
        component = fixture.componentInstance;
        component.card = {
          name: 'Larry Murfiray',
          title: 'Product design',
          avatar: 'http://i.pravatar.cc/200?img=5',
          dates: '11/07 - 20/07'
        };
        fixture.detectChanges();
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
