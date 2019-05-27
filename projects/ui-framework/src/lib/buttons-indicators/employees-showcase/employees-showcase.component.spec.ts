import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeesShowcaseComponent } from './employees-showcase.component';
import { DebugElement, NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { UtilsService } from '../../services/utils/utils.service';
import { of } from 'rxjs';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';
import { By } from '@angular/platform-browser';
import { getEmployeesMock } from './employees-showcase.mock';
import { AvatarSize } from '../avatar/avatar.enum';
import createSpyObj = jasmine.createSpyObj;
import { AvatarGap } from './employees-showcase.const';

describe('EmployeesShowcaseComponent', () => {
  let component: EmployeesShowcaseComponent;
  let fixture: ComponentFixture<EmployeesShowcaseComponent>;
  let utilsServiceStub: jasmine.SpyObj<UtilsService>;

  beforeEach(async(() => {
    utilsServiceStub = createSpyObj('UtilsService', ['getResizeEvent']);
    utilsServiceStub.getResizeEvent.and.returnValue(of());

    TestBed.configureTestingModule({
      declarations: [EmployeesShowcaseComponent],
      providers: [
        DOMhelpers,
        { provide: UtilsService, useValue: utilsServiceStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(EmployeesShowcaseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  describe('template', () => {
    let bAvatars: DebugElement[];
    let showMore: DebugElement;
    it('should display 0 mini avatars', () => {
      bAvatars = fixture.debugElement.queryAll(By.css('b-avatar'));
      showMore = fixture.debugElement.query(By.css('.show-more'));
      expect(bAvatars.length).toBe(0);
      expect(showMore).toBeFalsy();
    });
    it('should display 1 mini avatar', () => {
      component.employees = [getEmployeesMock()[0]];
      component.ngOnChanges({
        avatarSize: new SimpleChange(null, AvatarSize.mini, false)
      });
      fixture.detectChanges();
      bAvatars = fixture.debugElement.queryAll(By.css('b-avatar'));
      showMore = fixture.debugElement.query(By.css('.show-more'));
      expect(bAvatars.length).toBe(1);
      expect(showMore).toBeFalsy();
    });
    it('should display 2 mini avatars and correct gap', () => {
      spyOn<any>(component, 'getClientWidth').and.callFake(() => 50);
      component.employees = [getEmployeesMock()[0], getEmployeesMock()[0]];
      component.ngOnChanges({
        avatarSize: new SimpleChange(null, AvatarSize.mini, false)
      });
      fixture.detectChanges();
      bAvatars = fixture.debugElement.queryAll(By.css('b-avatar'));
      showMore = fixture.debugElement.query(By.css('.show-more'));
      expect(bAvatars.length).toBe(2);
      expect(showMore).toBeFalsy();
      expect(getComputedStyle(bAvatars[1].nativeElement).marginLeft).toEqual(
        '-' + AvatarGap[AvatarSize.mini] + 'px'
      );
    });
    it('should display 2 mini avatars one is the show more button', () => {
      spyOn<any>(component, 'getClientWidth').and.callFake(() => 50);
      component.employees = [
        getEmployeesMock()[0],
        getEmployeesMock()[0],
        getEmployeesMock()[0]
      ];
      component.ngOnChanges({
        avatarSize: new SimpleChange(null, AvatarSize.mini, false)
      });
      fixture.detectChanges();
      bAvatars = fixture.debugElement.queryAll(By.css('b-avatar'));
      showMore = fixture.debugElement.query(By.css('.show-more'));
      expect(bAvatars.length).toBe(2);
      expect(showMore.nativeElement).toBeTruthy();
    });
    it('should display 9 mini avatars', () => {
      component.employees = getEmployeesMock();
      component.ngOnChanges({
        avatarSize: new SimpleChange(null, AvatarSize.mini, false)
      });
      fixture.detectChanges();
      bAvatars = fixture.debugElement.queryAll(By.css('b-avatar'));
      showMore = fixture.debugElement.query(By.css('.show-more'));
      expect(bAvatars.length).toBe(9);
      expect(showMore).toBeFalsy();
    });
    it('should display 1 medium avatars', () => {
      spyOn<any>(component, 'getClientWidth').and.callFake(() => 150);
      component.employees = getEmployeesMock();
      component.avatarSize = AvatarSize.medium;
      component.ngOnChanges({
        avatarSize: new SimpleChange(null, AvatarSize.medium, false)
      });
      fixture.detectChanges();
      bAvatars = fixture.debugElement.queryAll(By.css('b-avatar'));
      showMore = fixture.debugElement.query(By.css('.show-more'));
      expect(bAvatars.length).toBe(1);
      expect(showMore).toBeFalsy();
    });
    it('should display 9 medium avatars and correct gap', () => {
      component.employees = getEmployeesMock();
      component.avatarSize = AvatarSize.medium;
      component.ngOnChanges({
        avatarSize: new SimpleChange(null, AvatarSize.medium, false)
      });
      fixture.detectChanges();
      bAvatars = fixture.debugElement.queryAll(By.css('b-avatar'));
      showMore = fixture.debugElement.query(By.css('.show-more'));
      expect(bAvatars.length).toBe(9);
      expect(showMore).toBeFalsy();
      expect(getComputedStyle(bAvatars[1].nativeElement).marginLeft).toEqual(
        '-' + AvatarGap[AvatarSize.medium] + 'px'
      );
    });
  });
});
