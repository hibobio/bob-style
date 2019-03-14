import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ListOptionComponent } from './list-option.component';
import { FiltersModule } from '../../../services/filters/filters.module';
import { AvatarComponent } from '../../../buttons-indicators/avatar/avatar.component';
import { NgModule } from '@angular/core';
import { AvatarModule } from '../../../buttons-indicators/avatar/avatar.module';
import { By } from '@angular/platform-browser';

@NgModule({
  imports: [AvatarModule],
  entryComponents: [AvatarComponent]
})
class ListOptionTestModule {}

describe('TextareaComponent', () => {
  let component: ListOptionComponent;
  let fixture: ComponentFixture<ListOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListOptionComponent],
      imports: [NoopAnimationsModule, FiltersModule, AvatarModule, ListOptionTestModule]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ListOptionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  describe('OnChanges', () => {
    it('should render avatar component if option has prefixComponent and ', () => {
      const simpleChanges = {
        option: {
          currentValue: {
            id: 123,
            groupName: 'option group',
            value: 'list option value',
            isPlaceHolder: false,
            selected: false,
            prefixComponent: {
              component: AvatarComponent,
              attributes: {
                imageSource: 'img_url.png'
              }
            }
          },
          firstChange: true,
          previousValue: undefined,
          isFirstChange: () => true
        },
        searchValue: {
          currentValue: undefined,
          firstChange: true,
          previousValue: undefined,
          isFirstChange: () => true
        }
      };
      component.ngOnChanges(simpleChanges);
      fixture.detectChanges();
      const avatarElement = fixture.debugElement.query(By.css('b-avatar'));
      expect(avatarElement).toBeTruthy();
      expect(avatarElement.componentInstance.imageSource).toEqual('img_url.png');
    });
    it('should not render component if option is placeholder', () => {
      const simpleChanges = {
        option: {
          currentValue: {
            id: 123,
            groupName: 'option group',
            value: 'list option value',
            isPlaceHolder: true,
            selected: false,
            prefixComponent: {
              component: AvatarComponent,
              attributes: {
                imageSource: 'img_url.png'
              }
            }
          },
          firstChange: true,
          previousValue: undefined,
          isFirstChange: () => true
        },
        searchValue: {
          currentValue: undefined,
          firstChange: true,
          previousValue: undefined,
          isFirstChange: () => true
        }
      };
      component.ngOnChanges(simpleChanges);
      fixture.detectChanges();
      const avatarElement = fixture.debugElement.query(By.css('b-avatar'));
      expect(avatarElement).toBeFalsy();
    });
    it('should not render component if option no component is configured', () => {
      const simpleChanges = {
        option: {
          currentValue: {
            id: 123,
            groupName: 'option group',
            value: 'list option value',
            isPlaceHolder: false,
            selected: false
          },
          firstChange: true,
          previousValue: undefined,
          isFirstChange: () => true
        },
        searchValue: {
          currentValue: undefined,
          firstChange: true,
          previousValue: undefined,
          isFirstChange: () => true
        }
      };
      component.ngOnChanges(simpleChanges);
      fixture.detectChanges();
      const avatarElement = fixture.debugElement.query(By.css('b-avatar'));
      expect(avatarElement).toBeFalsy();
    });
    it('should highlight searched letters', () => {
      component.option = {
        id: 123,
        groupName: 'option group',
        value: 'list option value',
        isPlaceHolder: false,
        selected: false
      };
      const simpleChanges = {
        searchValue: {
          currentValue: 'lis',
          firstChange: true,
          previousValue: undefined,
          isFirstChange: () => true
        }
      };
      component.ngOnChanges(simpleChanges);
      fixture.detectChanges();
      const valueEl = fixture.debugElement.query(By.css('.value'));
      expect(valueEl.nativeElement.innerHTML).toEqual(
        `<span class="highlight" style="font-weight: bold;">lis</span>t option value`
      );
    });
  });
});
