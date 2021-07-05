import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UtilsService } from '../../services/utils/utils.service';
import { AvatarLayoutComponent } from './avatar-layout.component';

describe('AvatarLayoutComponent', () => {
  let component: AvatarLayoutComponent;
  let fixture: ComponentFixture<AvatarLayoutComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AvatarLayoutComponent],
        providers: [UtilsService],
        schemas: [NO_ERRORS_SCHEMA],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(AvatarLayoutComponent);
          component = fixture.componentInstance;
          fixture.detectChanges();
        });
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
