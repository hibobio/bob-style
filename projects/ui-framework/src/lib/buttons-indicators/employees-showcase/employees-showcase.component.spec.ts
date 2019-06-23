import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { EmployeesShowcaseComponent } from './employees-showcase.component';
import { DebugElement, NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { UtilsService } from '../../services/utils/utils.service';
import { of } from 'rxjs';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';
import { By } from '@angular/platform-browser';
import { getEmployeesMock } from './employees-showcase.mock';
import { AvatarSize } from '../avatar/avatar.enum';
import { AvatarGap } from './employees-showcase.const';
import createSpyObj = jasmine.createSpyObj;

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
        fixture.nativeElement.style.width = '800px';
        fixture.detectChanges();
      });
  }));

  describe('ngOnInit', () => {
    it('should set showMoreOptions', () => {
      component.employees = [getEmployeesMock()[0]];
      component.ngOnInit();
      expect(component.showMoreOptions).toEqual([{
          groupName: '',
          options: [{
            value: 'Ben Baler',
            id: '1',
            selected: false,
            prefixComponent: {
              component: jasmine.any(Function),
              attributes: {
                imageSource:
                  'https://randomuser.me/api/portraits/men/1.jpg'
              }
            }
          }]
        }]
      );
    });
  });

  describe('ngOnChanges', () => {
    it('should shuffle employees when showMore is false and employees are larger than avatarsToFit', fakeAsync(() => {
      spyOn<any>(component, 'getClientWidth').and.callFake(() => 200);
      component.avatarSize = AvatarSize.medium;
      component.employees = getEmployeesMock();
      component.ngOnChanges({
        avatarSize: new SimpleChange(null, AvatarSize.medium, false)
      });
      tick(3000);
      expect(component.employees).not.toEqual(getEmployeesMock());
      fixture.destroy();
    }));
    it('should not shuffle employees when showMore is true', fakeAsync(() => {
      spyOn<any>(component, 'getClientWidth').and.callFake(() => 200);
      component.employees = getEmployeesMock();
      component.ngOnChanges({
        avatarSize: new SimpleChange(null, AvatarSize.medium, false)
      });
      tick(3000);
      expect(component.employees).toEqual(getEmployeesMock());
      fixture.destroy();
    }));
    it('should not shuffle employees when employees are not larger than avatarsToFit', fakeAsync(() => {
      component.avatarSize = AvatarSize.medium;
      component.employees = getEmployeesMock();
      component.ngOnChanges({
        avatarSize: new SimpleChange(null, AvatarSize.medium, false)
      });
      tick(3000);
      expect(component.employees).toEqual(getEmployeesMock());
      fixture.destroy();
    }));
  });

  describe('onSelectChange', () => {
    it('should emit selectChange', () => {
      const selectChange = spyOn(component.selectChange, 'emit');
      component.onSelectChange({ test: 'test' });
      expect(selectChange).toHaveBeenCalledWith({ test: 'test' });
    });
  });

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

  describe('ngAfterViewInit', () => {
    it('should call calcAvatars', fakeAsync(() => {
      const calcAvatars = spyOn<any>(component, 'calcAvatars');
      component.ngAfterViewInit();
      tick();
      expect(calcAvatars).toHaveBeenCalled();
    }));
  });
});
