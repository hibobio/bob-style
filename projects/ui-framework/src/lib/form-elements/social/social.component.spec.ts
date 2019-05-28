import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SocialComponent } from './social.component';
import { InputModule } from '../../form-elements/input/input.module';
import { IconsModule } from '../../icons/icons.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { SocialType } from './social.interface';
import { Icons } from '../../icons/icons.enum';
import { socialTypesConfig } from './social.const';

describe('SocialComponent', () => {
  let component: SocialComponent;
  let fixture: ComponentFixture<SocialComponent>;

  const assignSocialSelection = (type) => {
    const socialTypesRes = socialTypesConfig;
    const res = {
      facebook: 'www.facebook.com/AlanTulin',
      linkedin: 'www.linkedin.com/AlanTulin',
      twitter: 'www.twitter.com/AlanTulin'
    };
    expect(`${socialTypesRes[type].prefix}AlanTulin`).toEqual(res[type]);
  };



  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SocialComponent,
      ],
      imports: [
        NoopAnimationsModule,
        FormsModule,
        InputModule,
        IconsModule,
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SocialComponent);
        component = fixture.componentInstance;
        spyOn(component.socialInputChange, 'emit');
        component.type = SocialType.Facebook;
        fixture.detectChanges();
      });
  }));

  describe('ngOnInit', () => {
    fit('should assign social selection (facebook) to social input type', () => {
      const socialConfigRes = [  'facebook', 'linkedin', 'twitter'];
      for (const socialType of socialConfigRes) {
        assignSocialSelection(socialType);
      }
    });
    it('should assign value with value if exists', () => {
      component.value = 'www.facebook.com/AlanTulin';
      fixture.detectChanges();
      expect(component.value).toEqual('www.facebook.com/AlanTulin');
    });
  });

  describe('onInputEvents', () => {
    it('should invoke socialInputChange.emit with social value', () => {
      const inputElement = fixture.debugElement.query(By.css('input'));
      inputElement.nativeElement.value = 'AlanTulin';
      inputElement.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(component.socialInputChange.emit).toHaveBeenCalledWith('www.facebook.com/AlanTulin');
    });
  });
});
