import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarLayoutComponent } from './avatar-layout.component';
import {UtilsService} from '../../services/utils/utils.service';

describe('AvatarLayoutComponent', () => {
  let component: AvatarLayoutComponent;
  let fixture: ComponentFixture<AvatarLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvatarLayoutComponent ],
      providers: [
        UtilsService
      ]
    })
    .compileComponents().then(() => {
      fixture = TestBed.createComponent(AvatarLayoutComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});
