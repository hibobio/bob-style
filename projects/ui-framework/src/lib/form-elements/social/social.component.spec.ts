import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SocialComponent } from './social.component';
import { InputModule } from '../../form-elements/input/input.module';
import { IconsModule } from '../../icons/icons.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { Social } from './social.enum';
import { SocialTypes } from './social.const';
import { InputEventType } from '../form-elements.enum';
import { URLutils } from '../../services/url/url-utils.service';

describe('SocialComponent', () => {
  let component: SocialComponent;
  let fixture: ComponentFixture<SocialComponent>;

  const assignSocialSelection = (type) => {
    const socialTypesRes = SocialTypes;
    const res = {
      facebook: 'www.facebook.com/AlanTulin',
      linkedin: 'www.linkedin.com/in/AlanTulin',
      twitter: 'www.twitter.com/AlanTulin',
    };
    expect(`${socialTypesRes[type].prefix}AlanTulin`).toEqual(res[type]);
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SocialComponent],
      imports: [NoopAnimationsModule, InputModule, IconsModule],
      providers: [URLutils],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SocialComponent);
        component = fixture.componentInstance;
        component.wrapEvent = true;
        spyOn(component.changed, 'emit');
        component.changed.subscribe(() => {});
        component.type = Social.facebook;
      });
  }));

  afterEach(() => {
    component.changed.complete();
  });

  describe('ngOnInit', () => {
    it('should assign social selection (facebook) to social input type', () => {
      fixture.detectChanges();
      const socialConfigRes = ['facebook', 'linkedin', 'twitter'];
      for (const socialType of socialConfigRes) {
        assignSocialSelection(socialType);
      }
    });
    it('should assign value with value if exists', () => {
      component.value = 'www.facebook.com/AlanTulin';
      fixture.detectChanges();
      expect(component.value).toContain('www.facebook.com/AlanTulin');
    });
    it('should get input element id and attach to the label', () => {
      fixture.detectChanges();
      const inputElement = fixture.debugElement.query(By.css('b-input'));
      const label = fixture.debugElement.query(By.css('.bfe-label label'));
      expect(label.attributes.for).toEqual(inputElement.componentInstance.id);
    });
    it('should map label to type', () => {
      const testType = (type: Social, expectedLabel: string) => {
        component.type = type;
        fixture.detectChanges();
        const label = fixture.debugElement.query(By.css('.bfe-label label'));
        expect(label.nativeElement.innerText).toBe(expectedLabel);
      };
      testType(Social.facebook, 'Facebook');
      testType(Social.linkedin, 'Linkedin');
      testType(Social.twitter, 'Twitter');
    });
  });

  describe('onInputEvents', () => {
    it('should invoke changed.emit with social value', () => {
      const inputElement = fixture.debugElement.query(By.css('input'));
      inputElement.nativeElement.value = 'AlanTulin';
      inputElement.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(component.changed.emit).toHaveBeenCalledWith({
        event: InputEventType.onChange,
        value: 'https://www.facebook.com/AlanTulin',
      });
    });
  });
});
