import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DividerComponent } from './divider.component';

describe('DividerComponent', () => {
  let component: DividerComponent;
  let fixture: ComponentFixture<DividerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        DividerComponent,
      ],
      imports: [
        NoopAnimationsModule,
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DividerComponent);
        component = fixture.componentInstance;
      });
  }));

  describe('Divider layout', () => {
    it('should display text if text is provided', () => {
      const text = 'Some text';
      component.text = text;
      fixture.detectChanges();
      expect(fixture.nativeElement.innerText).toEqual(text);
    });
    it('should display empty string if no text is provided', () => {
      component.text = null;
      fixture.detectChanges();
      expect(fixture.nativeElement.innerText).toEqual('');
    });
  });
});
