import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LinkComponent } from './link.component';
import { By } from '@angular/platform-browser';
import { LinkColor, LinkTarget } from './link.enum';

describe('LinkComponent', () => {
  let component: LinkComponent;
  let fixture: ComponentFixture<LinkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LinkComponent],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(LinkComponent);
        component = fixture.componentInstance;
        component.config = {
          url: 'https://app.hibob.com',
          text: 'Learn more',
          color: LinkColor.primary,
          target: LinkTarget.blank,
        };
      });
  }));

  describe('Link', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should be with the right url and text', () => {
      const aElement = fixture.debugElement.query(By.css('a'));
      expect(aElement.componentInstance.config.text).toEqual('Learn more');
      expect(aElement.componentInstance.config.url).toEqual(
        'https://app.hibob.com'
      );
    });

    it('should open in new window', () => {
      const aElement = fixture.debugElement.query(By.css('a'));
      expect(aElement.nativeElement.getAttribute('target')).toEqual('_blank');
    });

    it('should have color primary', () => {
      const aElement = fixture.debugElement.query(By.css('a'));
      expect(aElement.classes.primary).toBeTruthy();
    });

    it('shout output link clicked event', () => {
      component.config = {
        url: '',
        text: 'Learn more',
      };
      spyOn(component.clicked, 'emit');
      fixture.detectChanges();

      const aElement = fixture.debugElement.query(By.css('a')).nativeElement;
      aElement.click();
      expect(component.clicked.emit).toHaveBeenCalled();
    });
  });
});
